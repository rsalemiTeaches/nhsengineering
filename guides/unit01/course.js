// What the {{PLACEHOLDERS}} in Unit 01's guides stand for.
//
// The builder is shared with nhsrobotics and carries none of this text: a lab
// that grades a working circuit and a project that grades a robot and a
// worksheet have nothing to say to each other. See builder/make.js.
//
// Called with the guide's frontmatter, so a value can use meta.number,
// meta.scaffold, meta.title and so on. Electronics does not need to yet.

module.exports = meta => ({

  SIMREAL:
    "Every lab has two halves. Build the circuit in the Tinkercad simulator " +
    "first and get it working there, then build the same circuit for real on " +
    "your bench. Show both. The simulator is where mistakes are cheap.",

  // Electronics has NO FLEX. A lab is 20 points on time, 18 if it is late or if
  // it came back for a redo, and there is nothing to earn beyond finishing it.
  // Robotics is the course where going further scores. A redo is NOT a zero: it
  // comes back until it is right and then scores 18, the same as late, so the
  // only way to score nothing is never to finish. See DECISIONS #12.
  GRADING:
    "This lab is worth 20 points. Show both halves, the simulation and the " +
    "real circuit, to get it checked off. A lab handed in after its due date " +
    "is worth 18. A lab that is not working yet comes back to you as a redo, " +
    "as many times as it takes, and is worth 18 once it is right. The only " +
    "way to score zero is not to finish it.",

});
