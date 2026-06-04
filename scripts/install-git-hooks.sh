#!/bin/sh
# Run once per clone: prevents Cursor co-author from appearing on GitHub.
cd "$(dirname "$0")/.." || exit 1
git config core.hooksPath .githooks
echo "Installed .githooks — Cursor co-author lines will be stripped from commits."
