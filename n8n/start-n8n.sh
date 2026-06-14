#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# AURA-WEAR n8n Startup Script (Docker)
# Usage: bash n8n/start-n8n.sh
# ──────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================================="
echo "  AURA-WEAR n8n Workflow Engine (Docker)"
echo "======================================================="

if ! command -v docker &>/dev/null; then
  echo "[✗] Docker not found. Install Docker first."
  exit 1
fi

echo "[✓] Docker found: $(docker --version)"
echo ""
echo "  Starting n8n container..."
docker compose -f "$SCRIPT_DIR/docker-compose.n8n.yml" up -d

echo ""
echo "  [✓] n8n is running!"
echo ""
echo "  Editor UI:   http://localhost:5678"
echo "  Webhook URL: http://localhost:5678/webhook/aura-chat"
echo ""
echo "  NEXT STEPS:"
echo "  1. Open http://localhost:5678 and create your account"
echo "  2. Click the menu → Import from file"
echo "  3. Select: n8n/aura-wear-workflow.json"
echo "  4. Click the OpenAI node → add your API key in Credentials"
echo "  5. Click 'Activate' toggle to enable the webhook"
echo "  6. Set in AURA-WEAR .env:"
echo "     N8N_WEBHOOK_URL=http://localhost:5678/webhook/aura-chat"
echo "  7. Restart FastAPI: uvicorn main:app --reload --port 8001"
echo ""
echo "  To stop n8n:"
echo "  docker compose -f n8n/docker-compose.n8n.yml down"
echo "======================================================="
