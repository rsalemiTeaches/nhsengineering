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
  home.** Guide source in `guides/unit01/` and `guides/unit02/`,
  ~~the builder as a submodule in `builder/`~~ — 2026-08-19: wrong, the
  builder submodule is checked out as `shared/`, not `builder/`; REFERENCE.md's
  prose is stale even though its own example commands already say `shared/`.
  The Google Docs importer is in `tools/`, vendored libraries in `third_party/`,
  the `intro2programming` notebooks as a submodule under `coursework/`.
- **`Class Development`** — the deployed documents, and NOT home. Unit 01
  guides land in `Engineering/Projects/Unit 01—Electronics/`. Unit 02 guides
  deploy to `Unit 02—Software Engineering/`, at that folder's root — not
  nested under `Engineering/`, unlike Unit 01. The original Unit 01 Google
  Docs were moved to `Engineering/Unit 01 Google Doocs/` — the folder name has
  a typo.

## Sandbox setup

No sandbox needed beyond the `shared/` submodule sync, which `start-thread`
already runs automatically. Building a guide to PDF works in a fresh
sandbox as long as the guide has no emoji in it — see the Unit 01 note
below about `🤖` and the build machine deciding the font.

## Current units

Two units are active: Unit 01 (Electronics, importing/polishing finished
guides) and Unit 02 (Software Engineering, being written from scratch).

## Unit 01 — Electronics

**Ten guides, imported from Google Docs and building to PDF. None has been
taught from in this form.**

| # | Guide | Pages |
|---|---|---|
| E00 | Set Up the Arduino IDE | 8 |
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
  walkthrough, with ten new screenshots. Its Exercise 2 is now **one** assignment
  — blink S-O-S in Morse code — instead of a timing exercise that duplicated E03.
  E03 says up front that it carries no new code and the job is the wiring.
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

**The import is still raw, and this is the largest thing left.** It carried the
words and the pictures across and nothing else. Two concrete gaps:

- **No shared skeleton.** Robotics P02 has a shape every guide repeats: *Part 1:
  How it works*, then *Part 2: Do the work* as *Step 1: Set up*, *Step 2: Type in
  WORK 1*, WORK 2, WORK 3, *Step 5: Worksheet and check off*, *FLEX: The A+*. A
  student who has done P01 knows where they are in P05. Engineering has no shape
  at all: E02 runs *Switch on a breadboard* → *Simulate the Circuit* → *Build the
  circuit* → *Real-life circuit*, two of which mean the same thing and one of
  which is orphaned; E07 is *A synthesizer example* → *Create a synthesizer* with
  *The hardware* / *The software* under each; E00 uses *Exercise 1* / *Exercise
  2*. Four guides, four skeletons, each inherited from whatever its Google Doc
  happened to do. The work is to pick one and rewrite all ten into it.
- **Diagram labels fused into the prose.** Floating callouts on a picture had
  nowhere to go, so the importer dropped them mid-sentence: E06's "Turn this
  knobTo light up these LEDs", E07's "Pin 2 driving the speakerSpeaker connected
  to GND", E02's "Switch controlling an LEDgndArduino". Every guide has some.

Grading is no longer part of this gap — see #12.

**A PDF must be built on Ray's Mac.** The worksheet's 🤖 renders there and comes
out as a placeholder box when built anywhere without an emoji font — the sandbox,
for one. The font is chosen when the PDF is made, not when it is opened, so the
build machine decides what a student sees.

**No student has held one of the new PDFs yet.** That's about the pipeline, not
the content: Ray has taught this class from these exact guides before, in their
original Google Doc form, and they work. See [DECISIONS #17](DECISIONS.md).

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
- **A sixth column for the late mark** on the checkoff sheet. The ◇ sits in the
  Due cell instead, next to the date it judges, so the description keeps its
  width. [DECISIONS #13](DECISIONS.md).
- **Correcting the 220Ω resistor photographs.** Deliberate — Tinkercad draws
  three colour bands and the real parts have four, so no one picture works for
  both. [DECISIONS #2](DECISIONS.md).

## Unit 02 — Software Engineering

**Coding with AI: writing specs (PRDs) and testing what the AI produces —
not software program management.** [DECISIONS #19](DECISIONS.md). This is
Level 4 AI-assisted development: the AI writes all the code, humans write
the prompt and check the result, and reading or writing code is not a goal
of this unit at any project. Verification throughout is behavioral only —
run it, check it against the prompt, never open the code.
[DECISIONS #29](DECISIONS.md). Guides live in `guides/unit02/`, named
`pNN.md` (Unit 01 owns `eNN`), each with their own `course.js` and
`deploy.txt`.

### What's done

- **Project 01 (`p01.md`) and Project 02 (`p02.md`) are written and build
  clean.** P01 sets up the whole term's tools once: terminal, one git repo
  at `swdev/` for every project this term, `uv` (via `brew install uv`),
  and `pico` as the editor. P02 hand-types a pygame square that bounces off
  all four walls, paced with `clock.tick(60)` — deliberately rehearsing, by
  hand, the "box bounces around the screen" shape students will later ask
  an AI to build. Neither project uses AI yet. [DECISIONS #22](DECISIONS.md).
- **Students work from printed guides, not a screen.**
  [DECISIONS #21](DECISIONS.md).
- **The old Drive content for "Unit 02" does not carry over**, except
  possibly the game roster. `Class Development/Unit 02—Software
  Engineering/` still has the old `Software Change Request` bug-tracking
  form (a past program-management class, not this one) and a
  `Game Assignments.pdf` roster (14 students across Pong/Breakout/Snake/
  Space Invaders/Frogger) that may still be reused for game assignment.
  [DECISIONS #19](DECISIONS.md).
- **Ollama deployment is settled, mechanism and all**: a USB thumb drive
  and one script, `tools/install-ollama.sh`, installs the app, the model,
  and wires up all 8 local accounts (`blue01`–`blue04`, `red01`–`red04`) on
  a lab Mac in one run — no live network pull, no per-account manual setup.
  See `OLLAMA-SETUP.md` for the full build-the-drive-then-run-it process.
  Model is `qwen2.5-coder:7b`, sized for the lab Macs' 16GB Apple Silicon.
  [DECISIONS #23, #30](DECISIONS.md).
- **Unit 02 grading is settled**: 20 points on time, 18 late, a redo scores
  18 once it's right, an unfinished project scores a zero. Same numbers as
  Unit 01, but the printed text stands on its own — no cross-reference to
  another unit. [DECISIONS #26](DECISIONS.md).
- **The unit is ten projects, one class period each, and the MVP finishes at
  P07** — not a separate MVP project. P01–P03 are the same for everyone;
  P04 onward each student builds their own assigned game one piece at a time.
  [DECISIONS #32](DECISIONS.md).
- **Projects 04 and 05 are written and build clean.** P04 is the first PRD a
  student writes themselves and gets their game's player moving with the
  keyboard; P05 adds the one mechanic that makes it their game, and is the
  first time they hand Ollama existing code and ask for one addition. Both
  carry a per-game section — Pong, Breakout, Snake, Space Invaders, Frogger —
  so one guide serves all five without going vague. P05 introduces the thing
  P06 onward depends on: re-checking the *old* requirements after every
  addition, since an AI rewriting a program breaks working things silently.
  [DECISIONS #32, #33, #34, #35](DECISIONS.md).
- **Students attach files to Ollama, never paste them.** P04 attaches
  `PRD.md`; P05 onward attaches both `PRD.md` and `game.py` every chat, and
  types only the one new requirement. Attaching the PRD is not the same as
  asking for the whole game — it is how the AI knows what not to break.
  [DECISIONS #38](DECISIONS.md).
- **The long-thread lesson is taught in P04**, at Step 11 — why a chat slows
  down, how to reset it, and no rule about when. P05 relies on it.
  [DECISIONS #25, #39](DECISIONS.md).
- **The MVP is built one requirement at a time**, not as one whole-game
  prompt. [DECISIONS #33](DECISIONS.md).
- **All work from P04 on lives in one folder, `swdev/game/`**, with one
  `game.py` and one `PRD.md`. The PRD is updated before the code, every
  project. Each project ends with a commit and a `pNN` git tag; recovery is
  `git checkout pNN -- game/game.py`. [DECISIONS #34, #35](DECISIONS.md).
- **The Unit 02 checkoff sheet is generated** by `guides/unit02/tracker.js`,
  one Done column instead of Unit 01's Sim/Real pair, listing all ten
  projects. PowerSchool is the official record of completion.
  [DECISIONS #36](DECISIONS.md).
- **Project 03 (`p03.md`) is written and builds clean.** Introduces Ollama:
  a teacher-given prompt (students write their own starting P04) asks for a
  bouncing circle — deliberately different window size, radius, and
  bounce-color behavior from P02's square. Students prompt through the
  Ollama desktop app only, never the CLI, so they use its per-block Copy
  button instead of hand-selecting code out of Terminal text. Verification
  is behavioral only — run it, check it against the prompt, never read the
  code — and a crash (error, no window) is handled as its own step,
  separate from "runs but doesn't match": paste the error back to Ollama
  and ask it to fix it. [DECISIONS #27, #28, #29](DECISIONS.md).

### What's open

- **Projects 06 through 10 not written.** P06 puts a score on screen, P07
  adds win/lose/restart and completes the MVP, P08 is the visual reskin,
  P09 and P10 are one backlog feature each. Their titles are already
  printed on the checkoff sheet by `tracker.js`, so a title change there
  means regenerating the sheet.
- **`shared/` has an uncommitted fix and an uncommitted test**
  ([DECISIONS #37](DECISIONS.md)) — `build-all.sh` no longer demands
  `Class Development` on a non-deploy run. Both robotics repos get it when
  their pins move, and per #11 that means rebuilding and eyeballing their
  guides.
- **No Unit 02 guide has been deployed from this thread.** `Class
  Development` was not mounted, so P04, P05 and the checkoff sheet were
  built but not copied to Drive.
- **An unexplained `game.py` and a screenshot showed up untracked** in
  `swdev` during Ray's own hands-on test of the guides — not created by
  either guide, purpose unconfirmed.
