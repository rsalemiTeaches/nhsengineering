#!/usr/bin/env python3
"""Turn a Google-Docs-exported .docx into markdown plus its pictures.

    python3 docx_to_md.py in.docx out_dir slug

Writes out_dir/<slug>.md and out_dir/images/<slug>_NN.png. Pictures land in the
markdown exactly where they sit in the document, including inside table cells,
because the body is walked in document order rather than scraped for text.

JPEGs are re-saved as PNG: the guide builder reads the PNG header and refuses
anything else.

V01
"""
import sys, os, re, zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
RELNS = "{http://schemas.openxmlformats.org/package/2006/relationships}"

HEADING = {"Title": "#", "Heading1": "#", "Heading2": "##",
           "Heading3": "###", "Heading4": "####"}

# Google Docs writes code as ordinary paragraphs in a monospace face. That is
# the only signal there is, so it is the one used: a paragraph whose runs are
# all monospace is a line of code, and a run of them becomes a fenced block.
MONO = ("Courier", "Consolas", "Roboto Mono", "Menlo", "Monaco", "Mono")


def is_mono(run):
    props = run.find(f"{W}rPr")
    if props is None:
        return False
    fonts = props.find(f"{W}rFonts")
    if fonts is None:
        return False
    name = fonts.get(f"{W}ascii") or ""
    return any(m.lower() in name.lower() for m in MONO)


def rels(zf):
    root = ET.fromstring(zf.read("word/_rels/document.xml.rels"))
    return {r.get("Id"): r.get("Target") for r in root.findall(f"{RELNS}Relationship")}


# Google Docs sprinkles private-use glyphs into syntax-highlighted text. They
# are invisible in Docs and garbage everywhere else.
PUA = re.compile(r"[-﻿]")


def clean(text):
    return PUA.sub("", text)


def run_text(run):
    """One run's text, with bold and italic carried over as markdown."""
    text = clean("".join(node.text or "" for node in run.iter(f"{W}t")))
    if not text:
        return ""
    props = run.find(f"{W}rPr")
    bold = props is not None and props.find(f"{W}b") is not None
    ital = props is not None and props.find(f"{W}i") is not None
    lead = len(text) - len(text.lstrip())
    tail = len(text) - len(text.rstrip())
    core = text.strip()
    if not core:
        return text
    if bold:
        core = f"**{core}**"
    if ital:
        core = f"*{core}*"
    return " " * lead + core + " " * tail


class Converter:
    def __init__(self, zf, slug, images_dir):
        self.zf = zf
        self.slug = slug
        self.images_dir = images_dir
        self.rel = rels(zf)
        self.seen = {}          # media target -> written filename
        self.count = 0

    def image(self, embed_id):
        target = self.rel.get(embed_id)
        if not target:
            return None
        if target in self.seen:
            return self.seen[target]
        data = self.zf.read("word/" + target.lstrip("/"))
        # Google Docs leaves 1x1 spacer pixels behind. They are not pictures.
        from PIL import Image
        import io
        if max(Image.open(io.BytesIO(data)).size) <= 2:
            self.seen[target] = None
            return None
        self.count += 1
        name = f"{self.slug}_{self.count:02d}.png"
        out = os.path.join(self.images_dir, name)
        if target.lower().endswith(".png"):
            with open(out, "wb") as fh:
                fh.write(data)
        else:
            from PIL import Image
            import io
            Image.open(io.BytesIO(data)).convert("RGB").save(out, "PNG")
        self.seen[target] = name
        return name

    def para(self, node):
        """A paragraph as (marker, text) where marker is '', '#', '-' etc."""
        style = ""
        props = node.find(f"{W}pPr")
        if props is not None:
            st = props.find(f"{W}pStyle")
            if st is not None:
                style = st.get(f"{W}val") or ""

        runs = node.findall(f"{W}r")
        pieces, images, raw = [], [], []
        for run in runs:
            pieces.append(run_text(run))
            raw.append(clean("".join(n.text or "" for n in run.iter(f"{W}t"))))
            for blip in run.iter(f"{A}blip"):
                embed = blip.get(f"{R}embed")
                if embed:
                    name = self.image(embed)
                    if name:
                        images.append(name)

        texted = [r for r in runs if clean("".join(n.text or "" for n in r.iter(f"{W}t"))).strip()]
        if texted and not HEADING.get(style) and all(is_mono(r) for r in texted):
            return [("code", "".join(raw).rstrip())]

        text = re.sub(r"\s+", " ", "".join(pieces)).strip()
        out = []
        prefix = HEADING.get(style)
        if prefix and text:
            out.append(("md", f"{prefix} {text}"))
        elif style.startswith("ListParagraph") and text:
            out.append(("md", f"- {text}"))
        elif text:
            out.append(("md", text))
        for name in images:
            out.append(("md", f"![[{name}]]"))
        return out

    def table(self, node):
        rows = []
        for tr in node.findall(f"{W}tr"):
            cells = []
            for tc in tr.findall(f"{W}tc"):
                bits = []
                for child in tc:
                    if child.tag == f"{W}p":
                        bits += [line for _, line in self.para(child)]
                cells.append(" ".join(b.lstrip("# ").strip() for b in bits).strip())
            rows.append(cells)
        if not rows:
            return []
        width = max(len(r) for r in rows)
        rows = [r + [""] * (width - len(r)) for r in rows]
        out = ["| " + " | ".join(rows[0]) + " |",
               "|" + "---|" * width]
        for r in rows[1:]:
            out.append("| " + " | ".join(r) + " |")
        return [("table", line) for line in out]

    def convert(self):
        body = ET.fromstring(self.zf.read("word/document.xml")).find(f"{W}body")
        blocks = []
        for child in body:
            if child.tag == f"{W}p":
                blocks += self.para(child)
            elif child.tag == f"{W}tbl":
                blocks += self.table(child)

        lines, index = [], 0
        while index < len(blocks):
            kind, line = blocks[index]
            if kind == "code":
                run = []
                while index < len(blocks) and blocks[index][0] == "code":
                    run.append(blocks[index][1])
                    index += 1
                lines += ["```"] + run + ["```", ""]
            elif kind == "table":
                while index < len(blocks) and blocks[index][0] == "table":
                    lines.append(blocks[index][1])
                    index += 1
                lines.append("")
            else:
                lines += [line, ""]
                index += 1
        text = "\n".join(lines)
        return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def main():
    src, out_dir, slug = sys.argv[1], sys.argv[2], sys.argv[3]
    images_dir = os.path.join(out_dir, "images")
    os.makedirs(images_dir, exist_ok=True)
    with zipfile.ZipFile(src) as zf:
        conv = Converter(zf, slug, images_dir)
        md = conv.convert()
    with open(os.path.join(out_dir, slug + ".md"), "w") as fh:
        fh.write(md)
    print(f"{slug}: {conv.count} images, {len(md.splitlines())} lines")


if __name__ == "__main__":
    main()
