# Render deployment

Create a PostgreSQL database, a Python web service rooted at `api`, and a Node web service rooted at `web`.

API build command: `pip install -r requirements.txt`  
API start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`  
Web build command: `npm ci && npm run build`  
Web start command: `npm start`

Set `DATABASE_URL`, a randomly generated `SECRET_KEY` of at least 32 characters, `CORS_ORIGINS`, and `NEXT_PUBLIC_API_URL`. Never commit production values. Run API and web test commands in GitHub Actions before auto-deploy.
