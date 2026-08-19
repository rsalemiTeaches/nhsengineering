// What the {{PLACEHOLDERS}} in Unit 02's guides stand for.
//
// The builder is shared with nhsengineering/guides/unit01 and nhsrobotics; it
// carries none of this text itself. See DECISIONS #16 in this repo's
// DECISIONS.md.
//
// Called with the guide's frontmatter, so a value can use meta.number,
// meta.title and so on. Unit 02 does not need to yet.

module.exports = meta => ({

  // Settled 2026-08-19: same grading as Unit 01 (DECISIONS #12) — "lab"
  // becomes "project" since Unit 02 has no sim/real split to describe.
  GRADING:
    "A project is 20 points on time, 18 points late. A redo comes back " +
    "until it is right, and then scores 18. An unfinished project scores " +
    "a zero.",

});
