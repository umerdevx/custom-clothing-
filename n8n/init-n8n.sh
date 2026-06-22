#!/bin/sh
set -e

# Install dependencies in Alpine
apk add --no-cache curl jq > /dev/null 2>&1

N8N_URL="${N8N_URL:-http://n8n:5678}"
N8N_EMAIL="${N8N_EMAIL:-admin@aura-wear.com}"
N8N_PASSWORD="${N8N_PASSWORD:-AuraAdmin2024!}"
WORKFLOW_FILE="${WORKFLOW_FILE:-/data/aura-wear-workflow.json}"
COOKIE_JAR="/tmp/n8n_cookies.txt"

log() { echo "[n8n-init] $*"; }

# ── 1. Wait for n8n to be ready ──────────────────────────────────────────────
log "Waiting for n8n at ${N8N_URL}..."
ATTEMPTS=0
until curl -sf "${N8N_URL}/healthz" > /dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 90 ]; then
    log "ERROR: n8n did not become ready after 270 seconds. Giving up."
    exit 1
  fi
  log "Not ready yet (attempt ${ATTEMPTS}/90), retrying in 3s..."
  sleep 3
done
log "n8n is ready!"

# ── 2. Owner setup (first run only) ──────────────────────────────────────────
log "Attempting owner account setup..."
SETUP_CODE=$(curl -s -c "$COOKIE_JAR" -o /tmp/setup_resp.json -w "%{http_code}" \
  -X POST "${N8N_URL}/rest/owner/setup" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"${N8N_EMAIL}\",
    \"firstName\":\"Aura\",
    \"lastName\":\"Admin\",
    \"password\":\"${N8N_PASSWORD}\",
    \"agree\":true
  }")

case "$SETUP_CODE" in
  200|201) log "Owner account created." ;;
  400)     log "Owner already exists — skipping setup." ;;
  *)       log "Owner setup returned ${SETUP_CODE} — continuing anyway." ;;
esac

# ── 3. Login ─────────────────────────────────────────────────────────────────
log "Logging in as ${N8N_EMAIL}..."
LOGIN_CODE=$(curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -o /tmp/login_resp.json -w "%{http_code}" \
  -X POST "${N8N_URL}/rest/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${N8N_EMAIL}\",\"password\":\"${N8N_PASSWORD}\"}")

if [ "$LOGIN_CODE" != "200" ]; then
  log "ERROR: Login failed (HTTP ${LOGIN_CODE})."
  cat /tmp/login_resp.json
  exit 1
fi
log "Logged in successfully."

# ── 4. Check if workflow already exists ──────────────────────────────────────
log "Checking existing workflows..."
WORKFLOWS_JSON=$(curl -s -b "$COOKIE_JAR" "${N8N_URL}/rest/workflows")
EXISTING_ID=$(echo "$WORKFLOWS_JSON" | \
  jq -r '.data[] | select(.name == "AURA-WEAR Chatbot") | .id' 2>/dev/null | head -1)

if [ -n "$EXISTING_ID" ] && [ "$EXISTING_ID" != "null" ]; then
  log "Workflow 'AURA-WEAR Chatbot' already exists (id: ${EXISTING_ID})."
  IS_ACTIVE=$(echo "$WORKFLOWS_JSON" | \
    jq -r '.data[] | select(.name == "AURA-WEAR Chatbot") | .active' 2>/dev/null | head -1)

  if [ "$IS_ACTIVE" = "true" ]; then
    log "Workflow is already active. Nothing to do."
  else
    log "Activating existing workflow..."
    curl -s -b "$COOKIE_JAR" -X PATCH "${N8N_URL}/rest/workflows/${EXISTING_ID}" \
      -H "Content-Type: application/json" \
      -d '{"active":true}' > /dev/null
    log "Workflow activated."
  fi
else
  # ── 5. Import workflow ────────────────────────────────────────────────────
  log "Importing AURA-WEAR Chatbot workflow..."
  # Strip 'id' so n8n assigns a fresh one; set active=false for initial import
  PAYLOAD=$(jq 'del(.id) | .active = false' "$WORKFLOW_FILE")

  IMPORT_CODE=$(curl -s -b "$COOKIE_JAR" \
    -o /tmp/import_resp.json -w "%{http_code}" \
    -X POST "${N8N_URL}/rest/workflows" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")

  if [ "$IMPORT_CODE" != "200" ] && [ "$IMPORT_CODE" != "201" ]; then
    log "ERROR: Workflow import failed (HTTP ${IMPORT_CODE})."
    cat /tmp/import_resp.json
    exit 1
  fi

  NEW_ID=$(jq -r '.data.id' /tmp/import_resp.json 2>/dev/null)
  log "Workflow imported (id: ${NEW_ID}). Activating..."

  # ── 6. Activate workflow ──────────────────────────────────────────────────
  ACTIVATE_CODE=$(curl -s -b "$COOKIE_JAR" \
    -o /tmp/activate_resp.json -w "%{http_code}" \
    -X PATCH "${N8N_URL}/rest/workflows/${NEW_ID}" \
    -H "Content-Type: application/json" \
    -d '{"active":true}')

  if [ "$ACTIVATE_CODE" = "200" ]; then
    log "Workflow activated successfully!"
  else
    log "WARNING: Activation returned HTTP ${ACTIVATE_CODE}."
    cat /tmp/activate_resp.json
  fi
fi

log "Done! Webhook is live at: ${N8N_URL}/webhook/aura-chat"
