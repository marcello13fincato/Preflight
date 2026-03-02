#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Set it in the environment and re-run."
  exit 1
fi

echo "Running Prisma migrations against: $DATABASE_URL"
npx prisma migrate deploy
echo "Migrations applied."
