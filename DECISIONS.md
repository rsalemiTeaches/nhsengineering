# NHS Engineering — Decision Log

Numbers are permanent. A reversal is struck with its reason, not deleted.

This log covers Engineering only. Robotics keeps its own in `nhsrobotics`, and
each class keeps its own for the same reason: a shared log would mix courses and
a thread about one would open by reading the state of another.

1. **Every resistor in Unit 01 is 1 kΩ, and the bin holds nothing else.** The
   guides were written for 220Ω. They now say 1000Ω (1k) in E01, E02, E03 and
   E09. Stocking only one value means a student cannot pick the wrong one, and
   it removes the need to read colour bands before the course has taught them.
   — 2026-08-12

2. **The 220Ω resistor photographs stay wrong, and that is deliberate.** The
   parts-table pictures came from the old documents and show a 220Ω part. They
   are not being corrected to match, because the two systems disagree anyway:
   **Tinkercad draws three colour bands and the real resistors have four**, so no
   single picture can teach a student to identify the part in both places. The
   bin does that job instead — see #1.

   Anyone who later notices that the text says 1k and the picture does not: this
   is known. Leave it. — 2026-08-12

3. **The resistor row in a parts table has no picture.** Following from #2, the
   misleading photo is removed from E01, E02 and E03 rather than left in place.
   The row keeps the part name and an empty cell, so a correct 1 kΩ picture can
   drop straight in when there is one. The other parts — Arduino, LED, switch,
   breadboard — keep their photos, because a picture is how a beginner finds the
   thing in a bin. — 2026-08-12

4. **Engineering guides are built from markdown to PDF, in this repo.** The
   eleven Google Docs of Unit 01 were imported with `tools/docx_to_md.py`, which
   carries the words and the pictures across and nothing else. The originals are
   still in Drive and nothing was deleted. Word is not in the chain: a `.docx` is
   an intermediate written to a temp folder and thrown away, so no office suite
   is needed to make a guide or to print one. Guides deploy to
   `Class Development/Engineering/Projects/Unit 01—Electronics`. — 2026-08-12

5. ~~**The builder is a separate copy of the robotics one, not a shared
   library.** Same code today, and it may drift. Engineering is its own course
   and its guides answer to nothing in Robotics.~~ — 2026-08-12

   **Reversed by #11.** The freedom to drift was never used. What happened
   instead was three bugs found in Engineering that all had to be carried to
   Robotics by hand. — 2026-08-13

6. ~~**What a flex is worth in electronics is NOT decided.** Two guides already
   gesture at one — E00 asks for Morse code S-O-S, E04 asks for a light show of
   your own design — but no rule says what a flex is or what it scores. Until
   this is settled, `{{GRADING}}` in `guide_builder/build.js` is a marked TODO
   and no guide uses it.~~ — 2026-08-12

   **Settled by #12: electronics has no flex at all.** — 2026-08-13

7. **The builder rules came across with the copy, and they are not
   engineering's to re-decide.** Links print as their label, a bare link to
   another guide is refused, pictures are capped at 6.5 × 4.5 inches and do not
   chain across a page break, and `build-all.sh` only rebuilds what is stale.
   These are `nhsrobotics` DECISIONS #38, #39 and #40; the reasoning lives
   there, and [REFERENCE.md](REFERENCE.md) records what they mean in practice.
   Two of them — the picture caps and the chaining — were found *here*, in the
   imported guides, and fixed in both builders. — 2026-08-12

8. **Built guides are not committed, and neither is the import zip.** The
   markdown and the pictures in `guide_builder/images/` are the source; the PDFs
   are reproducible from them. Deployed copies live in
   `Class Development/Engineering/Projects/Unit 01—Electronics`. — 2026-08-12

9. **This repo is the Obsidian vault, with `third_party/` excluded.** Same
   arrangement as `nhsrobotics`: vault root is the repo, so there is no second
   copy of anything, and `.obsidian/workspace.json` is gitignored because it is
   per-machine layout. — 2026-08-12

10. **Engineering threads read these three files, not Robotics'.** `PROJECT.md`,
    `DECISIONS.md` and `REFERENCE.md` now exist here. Both repos have a
    `PROJECT.md`, and `start-thread` orients on whichever it finds, so an
    Engineering thread should mount this folder alone. — 2026-08-12

11. **The builder is one shared repository, `rsalemiTeaches/guide-builder`, a
    submodule of both courses.** This reverses #5, which kept a separate copy so
    the two were free to drift. They never did. Of 586 lines, everything but two
    string constants is course-neutral, and three defects found while working on
    Engineering — the picture size caps, pictures chaining across a page break,
    and a picture keeping with the heading below it — each had to be carried to
    Robotics by hand. #7 had already conceded the substance of this by ruling
    that the builder's rules were not Engineering's to re-decide: that is a
    shared library with no mechanism, which is the worst arrangement available.

    Each course pins its own commit, so a change arrives when its pin moves and
    not before. **Bumping a pin means rebuilding and eyeballing the guides in
    both courses** — pagination is the shared failure mode, and it fails
    quietly.

    The layout changed with it. `guide_builder/` is gone: guides, `images/` and
    the checkoff sheet are in `guides/unit01/`, the builder is in `builder/`,
    and the build runs from the guides' folder because the builder no longer
    assumes it sits beside them. Anything in an earlier entry that says
    `guide_builder/` means `guides/unit01/`. — 2026-08-13

12. **Electronics has no flex. A lab is 20 points on time and 18 late, a redo
    comes back until it is right and then scores 18, and the only zero is a lab
    never finished.** This settles #6. Going further is Robotics' idea, where a
    flex scores 20 against 19 for all the work; Electronics comes first and its
    job is getting a circuit to work at all.

    Three guides used to offer a flex for an A+ — E00's Morse code, E04's light
    show, E06's LED layout. Each now simply requires the thing, because a reward
    the gradebook does not pay is one a student notices. The Morse code exercise
    was kept rather than deleted: it is the only place in E00 that asks a
    student to work something out.

    Every guide prints this rule from `{{GRADING}}`, so there is one copy of it
    and it cannot drift between guides. That text started in `builder/build.js`
    and moved to `guides/unit01/course.js` when the builder became shared — see
    #16. — 2026-08-13

13. **The student checkoff sheet is generated, not written.**
    `guides/unit01/tracker.js` holds the project list and writes *Completed
    Electronics Projects.pdf*; it is gitignored like the guides and never edited
    by hand, for the same reason no guide has an editable copy. It was briefly
    deployed as a `.docx` — the format it was imported in — which was wrong on
    this repo's own rules: a Word file invites a hand-fix the next build throws
    away, and a form is where reflow between Word versions hurts most. The
    old `tracker.md` is deleted — it was a second copy of the same grid.

    The builder does not make this one. The reason first given here was that
    `parse.js` had no tables; that stopped being true the same day — see #14 —
    and it was the wrong reason anyway. The real one is that the sheet is a
    form, not a guide: write-on lines, a name block, and checkbox glyphs sized
    by hand, none of which the guide grammar expresses. It borrows the builder's
    `docx` package and its `topdf.js` rather than keeping a second copy of either.

    Students write the due date in themselves, and a ◇ beside it is the
    teacher's mark for late. The diamond is deliberately not a square, so it
    cannot be misread as one more box to complete. — 2026-08-13

14. **The builder renders markdown tables, and a table's first row is its
    header.** The parts tables in E01, E02 and E03 had been printing as raw
    markdown since the import — `| Arduino UNO | ![[e01_05.png]] |` and a row of
    dashes, on the page, for a student to read. `parse.js` had no table rule at
    all, so a `|` line fell through to an ordinary paragraph. Nobody had seen it
    because nothing has been taught from yet.

    Three things this settles:

    - **The first row is the header**, shaded and bold, as markdown says. The
      importer cannot know that and leaves a parts table with its first *data*
      row above the separator, so the three tables were given real
      `| Part | What it looks like |` headers by hand.
    - **A cell holding only a picture becomes that picture**, capped at 1.56
      inches tall. Width alone was tried first and gave three-inch rows that
      pushed E02 from six sheets to eight. A parts list wants a thumbnail to
      match against a bin, not a portrait.
    - **An empty cell stays empty**, which #3 depends on: the resistor row keeps
      its name and an empty cell so a correct 1 kΩ picture can drop in later.

    This is the first change made to the builder since it became shared, so it
    is also the first test of #11's rule: `nhsrobotics` gets it when its pin
    moves, and moving that pin means rebuilding and looking at its guides.
    — 2026-08-13

15. **The checkoff sheet and the worksheet are PDFs, not Word files.** Both were
    briefly deployed as `.docx` — the format the worksheet had always been in,
    and the format Engineering's sheet was first written to. That was wrong on
    this repo's own rules. A Word file invites a hand-fix that the next build
    throws away, and a form is exactly where reflow between Word versions hurts:
    ruled lines and box widths move. Both now reach PDF through the builder's
    `topdf.js`, which packs to a `.docx` in a temp folder, converts it, and
    deletes it — the same temp-and-discard chain a guide uses, so no editable
    copy exists anywhere.

    The superseded `.docx` files were removed from
    `Class Development/Engineering/Projects/Unit 01—Electronics` and
    `Class Development/Robotics/Project Guides`.

    **A consequence worth knowing: the machine that builds a PDF decides its
    fonts.** The worksheet's 🤖 renders on Ray's Mac and comes out a placeholder
    box built anywhere without an emoji font. This was invisible while the
    deliverable was a `.docx`, because the font was chosen when the file was
    opened. Affects both repos. — 2026-08-13

16. **The course's own text, deploy target and guide naming live with the
    guides, not in the builder.** #11 made the builder shared but left
    Engineering's `SIMREAL` and `GRADING` as constants inside `build.js`, its
    Drive path hardcoded in `build-all.sh`, and its `e*.md` glob assumed. None of
    that survived contact with Robotics, whose guides are `pNN.md` and whose
    placeholders are `SAVE`, `PARTA` and `GRADING` — one of them built from the
    guide's own project number.

    So three things moved out of the builder and into `guides/unit01/`:

    - **`course.js`** exports a function of the guide's frontmatter returning
      what each `{{PLACEHOLDER}}` says. Taking the frontmatter is what lets
      Robotics build `/workspace/p02.py` from the guide's `number` and
      `scaffold` without the builder knowing either field exists. A guides folder
      with no `course.js` is refused rather than guessed at, and a test covers
      that.
    - **`deploy.txt`** names the deploy folder relative to `Class Development`.
    - **A guide is a letter and two digits.** Never `*.md`, which would sweep up
      a README.

    This is the seam that makes one builder honest for two courses: the text a
    student reads about grading is the one thing that genuinely differs, and it
    is now the only thing. Affects both repos — `nhsrobotics` DECISIONS #43 is
    the same call from that side. — 2026-08-13

17. **The guide content is classroom-tested; only the new PDF pipeline is
    not.** Ray has taught this class from these exact guides before, in their
    original Google Doc form, and they work. "Nothing here has been taught
    from" in STATUS.md refers narrowly to the PDFs produced by the new
    markdown-to-PDF pipeline — no student has held one of those yet — not to
    the guides' pedagogical content or per-guide structure. The lack of a
    shared skeleton (see What's open) is a maintenance and consistency gap, not
    evidence that any individual guide's structure has failed in a classroom.
    — 2026-08-17

18. ~~**The ten guides get one shared 6-part skeleton: finished project, new
    concept, parts, software spec, simulation, real circuit.** This settles
    the "no shared skeleton" gap in What's open.~~ — 2026-08-17

    **Withdrawn — this was logged as a decision too early.** Ray was sketching
    a list of section headers to critique, not settling a policy. No guide has
    been rewritten to this shape, and it never got confirmed as the standard.
    The actual approach: walk every guide E00–E09 guide-by-guide first, the way
    E01 already was, and only suggest a standard afterward if the walkthrough
    shows one is worth having. — 2026-08-17
