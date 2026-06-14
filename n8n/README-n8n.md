# AURA-WEAR n8n Integration Guide

## What This Does

n8n powers the AI brain of AURA-WEAR's chatbot. When a customer asks a question:

1. **FastAPI** retrieves relevant data from the database (orders, products, fabrics, FAQs)
2. **FastAPI** forwards the query + retrieved context to this n8n webhook
3. **n8n** sends it to OpenAI GPT-4o-mini with a custom system prompt
4. **n8n** returns the AI reply back to FastAPI → shown to the customer

---

## Quick Start

### 1. Start n8n
```bash
bash n8n/start-n8n.sh
```
Or manually:
```bash
n8n start
```
Open: http://localhost:5678

### 2. Import the Workflow
1. In the n8n editor, click **+** → **Import from file**
2. Select `n8n/aura-wear-workflow.json`
3. The workflow loads with 5 nodes

### 3. Add OpenAI Credentials
1. Click the **OpenAI GPT-4o-mini** node
2. Click **Credentials** → **Create new**
3. Paste your OpenAI API key
4. Save

### 4. Activate the Webhook
1. Click **Activate** toggle (top right) to make the webhook live
2. The webhook URL will be: `http://localhost:5678/webhook/aura-chat`

### 5. Update AURA-WEAR .env
```bash
# In /home/shiji/Desktop/custom-clothing-/.env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/aura-chat
```

### 6. Restart the FastAPI backend
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

---

## Workflow Nodes

```
[Webhook Trigger] → [Prepare Prompt] → [OpenAI GPT-4o-mini] → [Extract Reply] → [Respond to Webhook]
```

| Node | Type | Purpose |
|---|---|---|
| **Webhook Trigger** | Webhook | Receives POST from FastAPI at `/webhook/aura-chat` |
| **Prepare Prompt** | Code (JS) | Builds system prompt + user message from query + DB context |
| **OpenAI GPT-4o-mini** | OpenAI | Calls GPT-4o-mini with 512 max tokens, temp 0.3 |
| **Extract Reply** | Code (JS) | Safely extracts text from OpenAI response |
| **Respond to Webhook** | Respond to Webhook | Returns `{"output": "..."}` to FastAPI |

---

## Payload Format

### FastAPI → n8n (incoming)
```json
{
  "query": "What fabric is best for winter hoodies?",
  "context": "MySQL Row -> Fabric: Brushed Fleece Grade 5, Type: fleece, Multiplier: 1.45x\nMySQL Row -> Product: Aura Sherpa-Lined Hoodie, Category: Hoodie, Base Price: PKR 3200",
  "session_id": "sess-abc-123",
  "user_id": 5
}
```

### n8n → FastAPI (response)
```json
{
  "output": "For winter hoodies, I recommend our Brushed Fleece Grade 4-5 fabric. It offers excellent warmth with a price multiplier of 1.3-1.45x. Our Aura Sherpa-Lined Hoodie (PKR 3,200 base) is our most popular winter option!"
}
```

---

## System Prompt (inside Prepare Prompt node)

The system prompt instructs the AI to:
- Only answer based on the database context provided
- Keep responses concise, friendly, professional
- Always quote prices in PKR
- Never fabricate order IDs or product data not in context
- Match the customer's language

---

## Testing the Workflow

Test directly in n8n by clicking **Test Workflow** and sending:
```json
{
  "body": {
    "query": "Tell me about your cotton t-shirts",
    "context": "MySQL Row -> Product: Aura Classic Polo Tee, Category: T-Shirt, Base Price: PKR 1400",
    "session_id": "test-123",
    "user_id": null
  }
}
```

Or test with curl once n8n is running:
```bash
curl -X POST http://localhost:5678/webhook-test/aura-chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What t-shirts do you have?",
    "context": "MySQL Row -> Product: Aura Classic Polo Tee, Category: T-Shirt, Base Price: PKR 1400",
    "session_id": "test-001",
    "user_id": null
  }'
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `N8N_WEBHOOK_URL` in .env not working | Make sure the workflow is **Activated** (not just saved) |
| OpenAI node fails | Check API key has credits; try GPT-3.5-turbo if quota is low |
| FastAPI falls back to local responses | Check `N8N_WEBHOOK_URL` is set correctly in `.env` and backend restarted |
| n8n not found after install | Add to PATH: `export PATH="$PATH:$(npm root -g)/../bin"` |
| Port 5678 already in use | Set `N8N_PORT=5679` in `.env.n8n` and update `N8N_WEBHOOK_URL` accordingly |

---

## Cost Estimate (GPT-4o-mini)

| Volume | Estimated Monthly Cost |
|---|---|
| 100 chats/day | ~$0.50–$1.00 |
| 500 chats/day | ~$2.50–$5.00 |
| Demo/FYP usage | < $0.10 |

GPT-4o-mini pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens.
