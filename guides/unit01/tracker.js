// The student checkoff sheet for Unit 01 — one page, a Sim box and a Real box
// per project. V01
//
//   node tracker.js                      -> Completed Electronics Projects.pdf
//   node tracker.js "Some Other Name.pdf"
//
// This script is the source. The PDF is output and there is no editable copy of
// the sheet anywhere, for the same reason no guide has one: an edit that is not
// here cannot survive the next run. Change the list below and run it again.
//
// It is not built by ../../shared — that makes guides, and this is a form:
// write-on lines, a name block, and checkbox glyphs sized by hand. It borrows
// the builder's topdf.js to reach a PDF, and the builder's copy of the
// `docx` package rather than keeping a second one, which is why the require
// below has a fallback: node looks for node_modules upwards from this file and
// the builder is sideways from here, not above it.
//
// The fourth field is "both" for a project with a simulation and a real
// circuit, or "ide" for project 00, which has no simulator half and gets one
// wide box instead.

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

const OUT = process.argv[2] || "Completed Electronics Projects.pdf";

const PAGE_W = 12240, PAGE_H = 15840, MARGIN = 1080;
const TABLE_W = PAGE_W - 2 * MARGIN;              // 10080 dxa
// Project | What you do | Due | Sim | Real. The Due cell carries the late
// diamond as well, rather than a sixth column: the mark is a judgement about
// the date, so it belongs beside it, and the description keeps its width.
const COL = [1080, 3640, 1720, 1820, 1820];

const projects = [
  ["00", "Set Up the Arduino IDE", "Get the Arduino IDE running and make the built-in LED blink.", "ide"],
  ["01", "LED Circuit", "Make the LED light up on the circuit board.", "both"],
  ["02", "LED Circuit with Switch", "Use a switch to turn the LED on and off.", "both"],
  ["03", "Arduino Blink", "Use the Arduino to make the LED blink.", "both"],
  ["04", "Read a Pin and Run a Light Show", "Set up several LEDs and use a switch to make a light show that changes when you press the button.", "both"],
  ["05", "Read a Pin with a Rheostat", "Connect a rheostat to an analog pin and print the voltage to the screen.", "both"],
  ["06", "Light LEDs with a Rheostat", "Make a row of LEDs light up by turning the knob on the rheostat.", "both"],
  ["07", "Synthesizer", "Attach a speaker and make a synthesizer.", "both"],
  ["08", "LCD Hello World", "Display a message on an LCD.", "both"],
  ["09", "The Simon Game", "Build and program the Simon game.", "both"],
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
    cell([t("Sim", {bold: true, align: AlignmentType.CENTER})], COL[3], {shade: "D9D9D9"}),
    cell([t("Real", {bold: true, align: AlignmentType.CENTER})], COL[4], {shade: "D9D9D9"}),
  ],
}));

for (const [num, title, what, kind] of projects) {
  const children = [
    cell([t(num, {bold: true, size: 26, align: AlignmentType.CENTER})], COL[0]),
    cell([t(title, {bold: true}), t(what, {size: 19, color: "404040"})], COL[1]),
    dueCell(),
  ];
  if (kind === "ide") {
    children.push(cell([
      t("IDE works", {italics: true, align: AlignmentType.CENTER, size: 19, color: "404040"}),
      box(),
    ], COL[3] + COL[4], {span: 2}));
  } else {
    children.push(cell([box()], COL[3]));
    children.push(cell([box()], COL[4]));
  }
  rows.push(new TableRow({children}));
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
        children: [new TextRun({text: "Completed Electronics Projects",
                                bold: true, size: 40, font: "Calibri"})],
      }),
      new Paragraph({
        spacing: {after: 240},
        border: {bottom: {style: BorderStyle.SINGLE, size: 6, color: "000000"}},
        children: [new TextRun({
          text: "Write the due date for each project in the Due column. Every project has two halves: " +
                "get it working in the Tinkercad simulator first, then build the same circuit for real " +
                "on your bench. Show each one to get it checked off.",
          size: 21, color: "404040"})],
      }),
      new Table({
        columnWidths: [5040, 2520, 2520],
        width: {size: TABLE_W, type: WidthType.DXA},
        borders: {top: NONE, bottom: NONE, left: NONE, right: NONE,
                  insideHorizontal: NONE, insideVertical: NONE},
        rows: [new TableRow({children: [
          nameLine("Name", 5040), nameLine("Class period", 2520), nameLine("Started", 2520),
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
          text: "Sim = working in Tinkercad.   Real = working on the bench, in front of your teacher.   " +
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
