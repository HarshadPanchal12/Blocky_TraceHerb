#!/bin/bash

# Navigate to application root
cd "$(dirname "$0")"

echo "🌿 Starting Blocky TraceHerb Full Stack Demo..."

# Start FastAPI backend in the background
echo "✅ Starting FastAPI Backend on port 8000..."
source api/venv/bin/activate
cd api && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait 2 seconds for backend to initialize
sleep 2

# Start Next.js frontend
echo "✅ Starting Next.js Frontend on port 3000..."
cd web && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ Both servers are now running!"
echo "➡️  Go to: http://localhost:3000/demo/ecommerce"
echo "Press [CTRL+C] to stop both servers."

# Trap CTRL+C to kill both processes
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' SIGINT

# Wait forever
wait
