#!/bin/bash
# One-time: move the builder out of this repo and into the shared submodule.
#
#   ./setup-builder.sh
#
# Everything except this script has already been done. The builder's files are
# staged in _builder_staging/ and the guides have already moved to
# guides/unit01/, which is why the build works right now. What is left needs
# your GitHub credentials, which is the only reason it is not done too.
#
# This script:
#   1. adds rsalemiTeaches/guide-builder as a submodule at builder/
#   2. copies the staged files into it, commits and pushes them
#   3. deletes the staging folder
#   4. rebuilds all ten guides through the submodule to prove it works
#
# Safe to stop and re-run: each step checks whether it already happened.

set -e
cd "$(dirname "$0")"
ROOT=$(pwd)
URL=https://github.com/rsalemiTeaches/guide-builder.git

if [ ! -d _builder_staging ]; then
    echo "_builder_staging/ is gone, so this has already run. Nothing to do."
    exit 0
fi

# 1. The submodule.
if [ ! -e builder/.git ]; then
    echo "==> adding $URL as builder/"
    git submodule add "$URL" builder
else
    echo "==> builder/ is already a submodule, leaving it"
fi

# 2. The files. node_modules is not committed; it is reinstalled from
#    package-lock.json, which is.
echo "==> copying the builder in"
for f in build.js parse.js make.js build-all.sh test-build.js README.md \
         package.json package-lock.json .gitignore; do
    cp "_builder_staging/$f" "builder/$f"
done
chmod +x builder/build-all.sh

cd builder
if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "The guide builder, shared by nhsengineering and nhsrobotics.

Lifted out of nhsengineering/guide_builder. Two changes came with it:

- Pictures and sibling guides resolve against the guide's own folder, passed
  in, never against the builder's own __dirname. A shared builder does not
  have anybody's pictures inside it.
- A picture no longer keeps with a following heading. Headings always keep
  with what follows, so picture -> heading -> picture was one unbreakable
  chain of any length -- the shape of every guide in Unit 01."
    git push -u origin HEAD
else
    echo "==> builder/ already committed, nothing to push"
fi
cd "$ROOT"

# 3. node_modules, so the build has docx to work with.
if [ ! -d builder/node_modules ]; then
    echo "==> npm install in builder/"
    ( cd builder && npm install --silent )
fi

# 4. Staging is done.
echo "==> removing _builder_staging/"
rm -rf _builder_staging

# 5. Prove it.
echo "==> rebuilding all ten guides through the submodule"
( cd guides/unit01 && "$ROOT/builder/build-all.sh" -f )

cat <<'DONE'

Done. What is left is yours to commit in this repo:

    git add -A
    git commit -m "Builder moves to the guide-builder submodule; guides to guides/unit01"

Still outstanding, and not something a script should decide:
  - nhsrobotics needs the same treatment, pinned to this same repo.
  - DECISIONS needs the entry that reverses #5.
DONE
