# NHS Engineering — Project

Home folder for the engineering curriculum. Three files:

- **`PROJECT.md`** (this file) — what is being worked on right now.
- **[DECISIONS.md](DECISIONS.md)** — settled calls, numbered and permanent.
- **[REFERENCE.md](REFERENCE.md)** — durable knowledge: how guides are made,
  what the unit teaches, and the failure modes that do not announce themselves.

## Where these live, and why it matters

**These three files live in `nhsengineering`, the engineering repo.** They are
never put in `Class Development`, which holds Robotics and Physics as well, and
where a single set would mix three courses — a thread about one would open by
reading the state of another. Robotics keeps its own set in `nhsrobotics`.

## Repos involved

- **`nhsengineering`** (`~/repos/sch_repo/nhsengineering`) — **this folder, and
  home.** Guide source in `guides/unit01/`, the builder as a submodule in
  `builder/`, the Google Docs
  importer in `tools/`, vendored libraries in `third_party/`, the
  `intro2programming` notebooks as a submodule under `coursework/`.
- **`Class Development`** — the deployed documents, and NOT home. Finished
  guides land in `Engineering/Projects/Unit 01—Electronics/`. The original
  Google Docs were moved to `Engineering/Unit 01 Google Doocs/` — the folder
  name has a typo.

## Current unit

**Unit 01 Electronics. Ten guides, imported from Google Docs and building to
PDF. None has been taught from in this form.**

| # | Guide | Pages |
|---|---|---|
| E00 | Set Up the Arduino IDE | 10 |
| E01 | LED Circuit | 4 |
| E02 | LED Circuit with Switch | 6 |
| E03 | Arduino Blink | 4 |
| E04 | Read a Pin and Run a Light Show | 4 |
| E05 | Read a Pin with a Rheostat | 4 |
| E06 | Light LEDs with a Rheostat | 2 |
| E07 | Synthesizer | 4 |
| E08 | LCD Hello World | 2 |
| E09 | The Simon Game | 4 |

`guides/unit01/tracker.js` generates the student checkoff sheet — a grid of Sim
and Real boxes for all ten, written as *Completed Electronics Projects.pdf*.
The script is the source; the PDF is output and is gitignored like the guides.
The builder does not make it — the sheet is a form, not a guide — but it uses the
builder's `topdf.js`, so Word is no more in this chain than in a guide's.

## What's done

- **The eleven Google Docs were imported to markdown**, with all their pictures,
  by `tools/docx_to_md.py`. The originals are untouched in Drive. See
  [DECISIONS #4](DECISIONS.md).
- **The builder produces PDFs, not Word files**, and it is now one shared repo
  pinned as the `builder/` submodule by both courses. Guides moved to
  `guides/unit01/`. [DECISIONS #11](DECISIONS.md).
- **Grading is settled: no flex.** 20 on time, 18 late, a redo scores 18 once it
  is right, zero only for a lab never finished. Every guide prints it from one
  string. [DECISIONS #12](DECISIONS.md).
- **Every resistor is 1 kΩ** in E01, E02, E03 and E09, and the resistor row in a
  parts table has no picture. [DECISIONS #1, #2, #3](DECISIONS.md).
- **E00 was rewritten for the desktop Arduino IDE**, replacing the Arduino Cloud
  walkthrough, with ten new screenshots.
- **The checkoff sheet is generated** by `guides/unit01/tracker.js`, with a
  hand-written due date and a ◇ the teacher marks for late.
  [DECISIONS #13](DECISIONS.md).
- **The builder renders tables.** The parts tables in E01, E02 and E03 had been
  printing as raw markdown since the import. [DECISIONS #14](DECISIONS.md).
- **`nhsrobotics` is on the same shared builder**, pinned to the same commit, and
  its nine guides build from it. Its course text moved to `guides/course.js` the
  same way Engineering's did.
- **The repo is an Obsidian vault.** Wikilinks on, `third_party/` excluded,
  `.obsidian/workspace.json` gitignored. Built guides are not committed.

## What's open

**The import is still raw.** It carried the words and the pictures across and
nothing else. The house voice and the heading structure are unwritten. Compare
any guide here against `nhsrobotics`' P01 or P02 to see the gap. Grading is no
longer part of this gap — see #12.

**E00 still teaches Blink twice.** Its Exercise 2 has students modify Blink,
which is what E03 is for. Ten pages against two to six for everything else.

**Nothing here has been taught from.** No student has held one of these PDFs.

## Paths not taken

- **Keeping the builder as a separate copy per course.** Tried for a day and
  reversed: the freedom to drift went unused while three fixes had to be
  hand-carried. [DECISIONS #5, reversed by #11](DECISIONS.md).
- **Giving Electronics a flex.** Rejected — going further is Robotics' idea, and
  Electronics' job is getting the circuit to work at all.
  [DECISIONS #12](DECISIONS.md).
- **Deleting E00's Morse code exercise** when the flex was removed. Kept as
  required work instead; it is the only part of E00 that asks a student to work
  something out.
- **Keeping Word as the deliverable.** The `.docx` is a temp intermediate now.
  No office suite is needed to make a guide or print one.
- **A separate `Engineering/Project Guides/` folder.** Made, then removed; the
  PDFs sit beside the unit in `Projects/Unit 01—Electronics/`.
- **Correcting the 220Ω resistor photographs.** Deliberate — Tinkercad draws
  three colour bands and the real parts have four, so no one picture works for
  both. [DECISIONS #2](DECISIONS.md).
