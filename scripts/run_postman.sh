#!/usr/bin/env bash
# Run Postman collection with newman (wrapper)
# Usage: ./scripts/run_postman.sh [baseUrl]
# Example: ./scripts/run_postman.sh http://localhost:3000

BASE_URL=${1:-http://localhost:3000}

# Use npx so no global install required
npx newman run postman_collection.json --env-var "baseUrl=${BASE_URL}" \
  --delay-request 250 --timeout-request 60000

# Exit code will reflect newman result
exit $?
