#!/bin/bash
# Tests the environment block that install-lab-software.sh writes to
# /etc/zshenv, /etc/profile and /etc/bashrc.
#
# Why this test can exist when the install itself cannot be tested: the
# install needs root and real hardware (DECISIONS #46), but the *content* of
# the environment block is just shell, and what it has to accomplish — git
# commits without asking who the student is — can be checked in a scratch
# directory with no privileges at all.
#
# What it checks:
#   1. The git lines are actually in the script.
#   2. They are single-quoted, so ${USER:-$(id -un)} lands in /etc/zshenv
#      unexpanded and resolves per account at shell startup. If someone
#      "fixes" these to double quotes, every account on the machine commits
#      as whoever ran the installer.
#   3. Sourced into a bare environment, `git commit` succeeds with no
#      identity prompt, the author is the account name, and `git init` makes
#      `main` without printing its hint paragraph.
#
# Run it before carrying the drive anywhere, same as --check.

set -u
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
INSTALLER="$SCRIPT_DIR/install-lab-software.sh"
fails=0

fail() { echo "FAIL: $*"; fails=$((fails + 1)); }
pass() { echo "ok:   $*"; }

[[ -f "$INSTALLER" ]] || { echo "FAIL: no install-lab-software.sh beside this test"; exit 1; }

# --- 1 & 2. The lines are present, and single-quoted -----------------------

for var in GIT_AUTHOR_NAME GIT_AUTHOR_EMAIL GIT_COMMITTER_NAME GIT_COMMITTER_EMAIL; do
  if grep -q "echo 'export $var=" "$INSTALLER"; then
    pass "$var is written, single-quoted"
  elif grep -q "export $var=" "$INSTALLER"; then
    fail "$var is written but not single-quoted — \${USER} would expand at install time, giving every account the installer's identity"
  else
    fail "$var is not written to the environment block"
  fi
done

for var in GIT_CONFIG_COUNT GIT_CONFIG_KEY_0 GIT_CONFIG_VALUE_0; do
  grep -q "export $var=" "$INSTALLER" \
    && pass "$var is written" \
    || fail "$var is not written — git init will print its default-branch hint"
done

# --- 3. Behavior, in a bare environment -----------------------------------
# Extract the exports from the installer rather than retyping them here, so
# the test cannot pass against a block the script no longer writes.

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

grep -o "echo 'export GIT_[^']*'" "$INSTALLER" \
  | sed "s/^echo '//; s/'$//" > "$tmp/envblock"
grep -o 'echo .export GIT_CONFIG[^"'"'"']*' "$INSTALLER" \
  | sed "s/^echo '//" >> "$tmp/envblock"

lines=$(grep -c . "$tmp/envblock")
[[ "$lines" -ge 7 ]] \
  && pass "extracted $lines export lines from the installer" \
  || fail "extracted only $lines export lines, expected 7 or more"

out=$(env -i HOME="$tmp" PATH=/usr/bin:/bin USER=blue01 bash -c "
  . '$tmp/envblock'
  cd '$tmp'
  git init repo >/dev/null 2>'$tmp/initerr'
  cd repo
  touch f && git add f
  git commit -m t >/dev/null 2>'$tmp/commiterr'
  echo \"branch=\$(git branch --show-current)\"
  echo \"author=\$(git log -1 --pretty='%an <%ae>')\"
" 2>&1)

if grep -q "Please tell me who you are" "$tmp/commiterr" 2>/dev/null; then
  fail "git asked for an identity — a student would hit this at P04 Step 12"
else
  pass "git committed with no identity prompt"
fi

echo "$out" | grep -q "author=blue01 <blue01@nhs.invalid>" \
  && pass "author resolved per account: blue01 <blue01@nhs.invalid>" \
  || fail "author was not the account name: $(echo "$out" | grep '^author=')"

echo "$out" | grep -q "branch=main" \
  && pass "git init made main" \
  || fail "git init did not make main: $(echo "$out" | grep '^branch=')"

if grep -q "hint:" "$tmp/initerr" 2>/dev/null; then
  fail "git init printed a hint paragraph a printed guide cannot explain"
else
  pass "git init printed no hint"
fi

# --- Result ---------------------------------------------------------------

echo ""
if [[ "$fails" -eq 0 ]]; then
  echo "All checks passed."
  exit 0
fi
echo "$fails check(s) failed."
exit 1
