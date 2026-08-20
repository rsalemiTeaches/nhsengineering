// The student checkoff sheet for Unit 02 — one page, one Done box per project.
// V01
//
//   node tracker.js                      -> Completed Software Projects.pdf
//   node tracker.js "Some Other Name.pdf"
//
// This script is the source. The PDF is output and there is no editable copy of
// the sheet anywhere, for the same reason no guide has one: an edit that is not
// here cannot survive the next run. Change the list below and run it again.
//
// Unit 01's sheet has a Sim box and a Real box per project because every
// electronics lab is built twice. Software has no such split — a project either
// runs and matches its PRD or it does not — so this sheet has one Done column.
//
// The official record of completion is the grade in PowerSchool. This sheet is
// the student's own map of where they are in the unit, which is why it also
// carries a one-line description of every project including ones not yet
// assigned.
//
// It is not built by ../../shared — that makes guides, and this is a form. It
// borrows the builder's topdf.js and its copy of the `docx` package rather than
// keeping a second one, which is why the require below has a fallback: node
// looks for node_modules upwards from this file and the builder is sideways
// from here, not above it.

const fs = require('fs');
const path = require('path');

let d;
try {
  d = require('docx');
} catch (e) {
  const shared = path.resolve(__dirname, '../../shared/node_modules/docx');
  try {
    d = require(shared);
  } catch (e2) {
    console.error("cannot find the 'docx' package.");
    console.error("it comes with the builder:  ( cd ../../shared && npm install )");
    process.exit(1);
  }
}

const {Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
       WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign} = d;

const OUT = process.argv[2] || "Completed Software Projects.pdf";

const PAGE_W = 12240, PAGE_H = 15840, MARGIN = 1080;
const TABLE_W = PAGE_W - 2 * MARGIN;              // 10080 dxa
// Project | What you do | Due | Done. The Due cell carries the late diamond as
// well, rather than a fifth column: the mark is a judgement about the date, so
// it belongs beside it, and the description keeps its width.
const COL = [1080, 5440, 1720, 1840];

// The fourth field marks the project that completes the MVP, which gets a note
// in the sheet rather than a column of its own.
//
// A fifth field, `parts`, turns one project into several checked lines instead
// of one. P01 through P04 are done or not done — the game runs, or it does not.
// P05 is not: "make it your own" is six separate things, and a student who
// recolors the background and stops has done one of them. Each gets its own
// box so neither of us can call it finished by feel.
const projects = [
  ["01", "Set Up Your Development Environment",
   "Get the terminal, git, uv, and the editor working, and run your first program."],
  ["02", "The Bouncing Square",
   "Hand-type a pygame program where a square bounces off all four walls."],
  ["03", "Ask an AI to Build It",
   "Give Ollama a prompt and let it write a bouncing circle for you."],
  ["04", "Build Your Base Game",
   "Write a PRD, get your assigned game running, and demonstrate it.", "mvp"],
  ["05", "Make Your Own Version",
   "One change at a time, PRD first. All six have to be done.", null,
   ["A new name",
    "A theme — what your game is about now",
    "A color scheme",
    "A new look for your sprite",
    "A new look for the other sprites",
    "A rule the base game did not have"]],
];

const HAIR = {style: BorderStyle.SINGLE, size: 4, color: "808080"};
const EDGE = {style: BorderStyle.SINGLE, size: 8, color: "000000"};
const NONE = {style: BorderStyle.NONE, size: 0, color: "FFFFFF"};

function cell(children, width, o = {}) {
  return new TableCell({
    width: {size: width, type: WidthType.DXA},
    verticalAlign: VerticalAlign.CENTER,
    margins: {top: 90, bottom: 90, left: 120, right: 120},
    borders: {top: HAIR, bottom: HAIR, left: EDGE, right: EDGE},
    ...(o.shade ? {shading: {type: ShadingType.CLEAR, fill: o.shade}} : {}),
    ...(o.span ? {columnSpan: o.span} : {}),
    children,
  });
}

const t = (text, o = {}) => new Paragraph({
  alignment: o.align || AlignmentType.LEFT,
  spacing: {before: 0, after: 0},
  children: [new TextRun({text, bold: !!o.bold, italics: !!o.italics,
                          size: o.size || 21, color: o.color || "000000"})],
});

// A big open box a teacher can tick or initial.
const box = () => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: {before: 20, after: 20},
  children: [new TextRun({text: "☐", size: 40})],
});

// The due date the student writes in, with the late diamond under it. The
// diamond is deliberately NOT a square: a square here would read as one more
// thing to complete, and this one is the teacher's mark, not the student's.
const dueCell = () => cell([
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {before: 60, after: 40},
    border: {bottom: {style: BorderStyle.SINGLE, size: 6, color: "000000"}},
    children: [new TextRun({text: "", size: 21})],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {before: 0, after: 20},
    children: [
      new TextRun({text: "◇", size: 26}),
      new TextRun({text: "  late", size: 16, italics: true, color: "595959"}),
    ],
  }),
], COL[2]);

const rows = [];

rows.push(new TableRow({
  tableHeader: true,
  children: [
    cell([t("Project", {bold: true, align: AlignmentType.CENTER})], COL[0], {shade: "D9D9D9"}),
    cell([t("What you do", {bold: true})], COL[1], {shade: "D9D9D9"}),
    cell([t("Due", {bold: true, align: AlignmentType.CENTER})], COL[2], {shade: "D9D9D9"}),
    cell([t("Done", {bold: true, align: AlignmentType.CENTER})], COL[3], {shade: "D9D9D9"}),
  ],
}));

for (const [num, title, what, kind, parts] of projects) {
  const desc = [t(title, {bold: true}), t(what, {size: 19, color: "404040"})];
  if (kind === "mvp") {
    desc.push(t("Your game is now playable start to finish. This is your MVP.",
                {size: 19, italics: true, color: "404040"}));
  }

  // A project with no parts is one row and one box. A project with parts keeps
  // its own row for the number and the due date, then gives each part a row of
  // its own -- so the Done column has one box per thing, not one box for six.
  rows.push(new TableRow({children: [
    cell([t(num, {bold: true, size: 26, align: AlignmentType.CENTER})], COL[0]),
    cell(desc, COL[1]),
    dueCell(),
    parts ? cell([t("", {size: 12})], COL[3]) : cell([box()], COL[3]),
  ]}));

  if (parts) {
    for (const part of parts) {
      rows.push(new TableRow({children: [
        cell([t("", {size: 12})], COL[0]),
        cell([t("     " + part, {size: 20})], COL[1]),
        cell([t("", {size: 12})], COL[2]),
        cell([box()], COL[3]),
      ]}));
    }
  }
}

const nameLine = (label, width) => new TableCell({
  width: {size: width, type: WidthType.DXA},
  borders: {top: NONE, left: NONE, right: NONE,
            bottom: {style: BorderStyle.SINGLE, size: 6, color: "000000"}},
  margins: {top: 60, bottom: 60, left: 0, right: 240},
  children: [t(label, {size: 22})],
});

const doc = new Document({
  styles: {default: {document: {run: {font: "Calibri", size: 22}}}},
  sections: [{
    properties: {page: {size: {width: PAGE_W, height: PAGE_H},
                        margin: {top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN}}},
    children: [
      new Paragraph({
        spacing: {after: 60},
        children: [new TextRun({text: "Completed Software Projects",
                                bold: true, size: 40, font: "Calibri"})],
      }),
      new Paragraph({
        spacing: {after: 240},
        border: {bottom: {style: BorderStyle.SINGLE, size: 6, color: "000000"}},
        children: [new TextRun({
          text: "Write the due date for each project in the Due column. Projects 01 through 03 are the " +
                "same for everyone. Project 04 is the game you were assigned, working. Project 05 is " +
                "your own version of it, and all six lines have to be checked. Show each one working " +
                "to get it checked off.",
          size: 21, color: "404040"})],
      }),
      new Table({
        columnWidths: [5040, 2520, 2520],
        width: {size: TABLE_W, type: WidthType.DXA},
        borders: {top: NONE, bottom: NONE, left: NONE, right: NONE,
                  insideHorizontal: NONE, insideVertical: NONE},
        rows: [new TableRow({children: [
          nameLine("Name", 5040), nameLine("Class period", 2520), nameLine("Your game", 2520),
        ]})],
      }),
      new Paragraph({text: "", spacing: {after: 240}}),
      new Table({
        columnWidths: COL,
        width: {size: TABLE_W, type: WidthType.DXA},
        borders: {top: EDGE, bottom: EDGE, left: EDGE, right: EDGE,
                  insideHorizontal: HAIR, insideVertical: EDGE},
        rows,
      }),
      new Paragraph({
        spacing: {before: 240},
        children: [new TextRun({
          text: "Done = running in front of your teacher, and matching what your own PRD says it should do.   " +
                "◇ is marked by your teacher if the project came in after its due date.",
          size: 19, italics: true, color: "595959"})],
      }),
    ],
  }],
});

// A PDF, not a Word file. The .docx is an intermediate in a temp folder and is
// deleted -- nothing an editor can open is left behind, so a typo fixed by hand
// cannot survive the next build. Same rule as the guides.
const {writePdf} = require(path.resolve(__dirname, '../../shared/topdf.js'));
writePdf(doc, OUT, Packer);
