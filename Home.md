# NHS Engineering

The vault is the repo. Everything here is plain text and lives in git.

## Start here

- [PROJECT.md](PROJECT.md) — what is being worked on right now.
- [DECISIONS.md](DECISIONS.md) — settled calls, numbered and permanent.
- [REFERENCE.md](REFERENCE.md) — how guides are made, what the unit teaches, and
  the failure modes that stay quiet.

## Unit 01 Electronics

One markdown file per guide, in `guides/unit01/`. The printed guides are PDFs
built from these. No office suite is involved, and the markdown is the only copy
anyone can edit.

| Guide | Title | Pages |
|---|---|---|
| [e00](guides/unit01/e00.md) | Set Up the Arduino IDE | 8 |
| [e01](guides/unit01/e01.md) | LED Circuit | 4 |
| [e02](guides/unit01/e02.md) | LED Circuit with Switch | 6 |
| [e03](guides/unit01/e03.md) | Arduino Blink | 4 |
| [e04](guides/unit01/e04.md) | Read a Pin and Run a Light Show | 4 |
| [e05](guides/unit01/e05.md) | Read a Pin with a Rheostat | 4 |
| [e06](guides/unit01/e06.md) | Light LEDs with a Rheostat | 2 |
| [e07](guides/unit01/e07.md) | Synthesizer | 4 |
| [e08](guides/unit01/e08.md) | LCD Hello World | 2 |
| [e09](guides/unit01/e09.md) | The Simon Game | 2 |

[tracker](guides/unit01/tracker.md) is the student checkoff grid — a Sim box and
a Real box per lab. It is not a guide and is not built.

## Building

The builder is `builder/`, a submodule shared with `nhsrobotics`. It holds no
guides and no pictures. Run it **from the folder the guides are in**.

```bash
cd guides/unit01
../../builder/build-all.sh          # build every guide that needs it
../../builder/build-all.sh e05.md   # build one
../../builder/build-all.sh -d       # build and copy into Unit 01—Electronics
../../builder/build-all.sh -f       # rebuild everything, current or not
node ../../builder/test-build.js    # check the builder
```

[builder/README.md](builder/README.md) explains the markdown the builder
understands.

## Links inside a guide

A link prints as its label and nothing else, because a guide is read on paper.

```
You already built this in [[e01|LED Circuit]].
```

prints as *You already built this in LED Circuit.* A bare link to another guide
is refused by the build, since `[[e01]]` would print a filename at a student.

Dragging a picture into a guide works — Obsidian writes `![[thing.png]]` and the
builder resolves it against the `images/` folder beside the guide.

*V01*
