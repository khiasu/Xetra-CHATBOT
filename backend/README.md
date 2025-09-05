# Xetra AI Chatbot - Backend

FastAPI backend for Xetra AI Chatbot.

## Local Development

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and update values

4. Start server:
   ```bash
   uvicorn app:app --reload
   ```

## Deployment

### Render.com

1. Create new Web Service
2. Connect GitHub repo
3. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - Environment: Add variables from `.env`

## API Docs

- Swagger UI: `/docs`
- OpenAPI: `/openapi.json`
