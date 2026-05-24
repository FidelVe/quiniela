#!/usr/bin/env bash
# Wipe the quiniela database.
#
#   pnpm reset-db        # asks for confirmation
#   pnpm reset-db -- -y  # skip the prompt (useful in CI / cron)
#
# After running:
#   - All participants, predictions, and match results are gone.
#   - The app re-seeds matches from data/fixtures.json on the next
#     request that touches the database.

set -euo pipefail

cd "$(dirname "$0")/.."

skip_confirm=false
case "${1:-}" in
  -y|--yes) skip_confirm=true ;;
  -h|--help)
    sed -n '2,/^set -euo/p' "$0" | sed -e 's/^#$//' -e 's/^# \{0,1\}//' -e '$d'
    exit 0
    ;;
esac

if ! $skip_confirm; then
  printf '\033[33m⚠  This will DELETE all participants, predictions, and match results.\033[0m\n'
  read -rp "Continue? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

if ! docker compose ps --format '{{.Service}} {{.State}}' 2>/dev/null | grep -qE '^db (running|restarting)$'; then
  echo "✗ The 'db' service is not running."
  echo "  Start the stack first:  docker compose up -d"
  exit 1
fi

echo "→ Wiping database…"
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q' <<'SQL'
TRUNCATE TABLE predictions, matches, participants RESTART IDENTITY CASCADE;
SQL

# The app caches its schema/seed init in memory for the life of the process,
# so a restart is required for it to re-seed fixtures into the empty matches
# table on the next request.
echo "→ Restarting app container so fixtures get re-seeded…"
docker compose restart app >/dev/null

echo "✓ Done."
