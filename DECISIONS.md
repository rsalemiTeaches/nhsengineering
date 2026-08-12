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

5. **The builder is a separate copy of the robotics one, not a shared library.**
   Same code today, and it may drift. Engineering is its own course and its
   guides answer to nothing in Robotics. — 2026-08-12

6. **What a flex is worth in electronics is NOT decided.** Two guides already
   gesture at one — E00 asks for Morse code S-O-S, E04 asks for a light show of
   your own design — but no rule says what a flex is or what it scores. Until
   this is settled, `{{GRADING}}` in `guide_builder/build.js` is a marked TODO
   and no guide uses it. — 2026-08-12
