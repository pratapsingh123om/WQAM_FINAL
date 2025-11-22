FROM python:3.11-slim
WORKDIR /app

# copy requirements if present
COPY requirements.txt . || true
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt || true; else echo "no requirements.txt, skipping pip install"; fi

COPY . .
EXPOSE 8000
CMD ["sh","-c","if [ -f app/main.py ] || [ -f app/main.py ]; then uvicorn app.main:app --host 0.0.0.0 --port 8000; else echo \"no ml app found; sleeping\"; tail -f /dev/null; fi"]
