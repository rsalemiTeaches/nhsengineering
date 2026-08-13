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
| E00 | Set Up the Arduino IDE | 12 |
| E01 | LED Circuit | 4 |
| E02 | LED Circuit with Switch | 6 |
| E03 | Arduino Blink | 4 |
| E04 | Read a Pin and Run a Light Show | 4 |
| E05 | Read a Pin with a Rheostat | 4 |
| E06 | Light LEDs with a Rheostat | 2 |
| E07 | Synthesizer | 4 |
| E08 | LCD Hello World | 2 |
| E09 | The Simon Game | 2 |

`guides/unit01/tracker.js` generates the student checkoff sheet — a grid of Sim
and Real boxes for all ten, written as *Completed Electronics Projects.docx*.
The script is the source; the docx is output and is gitignored like the PDFs.
The builder does not make it: the sheet is a table and the parser has none.

## What's done

- **The eleven Google Docs were imported to markdown**, with all their pictures,
  by `tools/docx_to_md.py`. The originals are untouched in Drive. See
  [DECISIONS #4](DECISIONS.md).
- **The builder produces PDFs, not Word files.** Its own copy of the robotics
  builder, deploying to `Unit 01—Electronics`. Word is not in the chain — see
  [DECISIONS #5](DECISIONS.md).
- **Every resistor is 1 kΩ** in E01, E02, E03 and E09, and the resistor row in a
  parts table has no picture. [DECISIONS #1, #2, #3](DECISIONS.md).
- **The repo is an Obsidian vault.** Wikilinks on, `third_party/` excluded,
  `.obsidian/workspace.json` gitignored. Built guides are not committed.

## What's open

**The import is raw, and that is the biggest piece of work left.** It carried
the words and the pictures across faithfully and nothing else. The house voice,
the heading structure, and whatever shape replaces Robotics' WORK/FLEX are all
still to be written. Compare any guide here against `nhsrobotics`' P01 or P02 to
see the gap.

**A flex is not defined.** E00 asks for Morse code S-O-S and E04 asks for a light
show of your own design, but no rule says what a flex is or what it scores.
`{{GRADING}}` in `builder/build.js` is a marked TODO and no guide uses it.
[DECISIONS #6](DECISIONS.md).

**The numbering inside two documents disagrees with their file names.** E08 opens
with "Project 09: Arduino Cloud Setup & LCD Hardware Check" and E09 opens with
"Project 10: The Simon Game." The file names and the tracker were followed.

**E00 is two guides in one.** It opens as the unit's front matter, then teaches
Lab 0 setup, and then its Step 3 has students modify Blink — which is what E03
is for. Twelve pages, three times any other guide.

**Nothing here has been taught from.** No student has held one of these PDFs.

## Paths not taken

- **Sharing one builder between the two courses.** Rejected: same code today,
  free to drift, and Engineering answers to nothing in Robotics.
  [DECISIONS #5](DECISIONS.md).
- **Keeping Word as the deliverable.** The `.docx` is a temp intermediate now.
  No office suite is needed to make a guide or print one.
- **A separate `Engineering/Project Guides/` folder.** Made, then removed; the
  PDFs sit beside the unit in `Projects/Unit 01—Electronics/`.
- **Correcting the 220Ω resistor photographs.** Deliberate — Tinkercad draws
  three colour bands and the real parts have four, so no one picture works for
  both. [DECISIONS #2](DECISIONS.md).
