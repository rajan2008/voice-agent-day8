@echo off
echo ========================================
echo Starting Day 8 Voice Game Master
echo ========================================
echo.

REM Start LiveKit server
echo [1/3] Starting LiveKit server...
start "LiveKit Server" cmd /k "cd livekit && livekit-server --dev"
echo Waiting for LiveKit server to start...
timeout /t 5 /nobreak >nul

REM Start backend agent
echo [2/3] Starting Game Master agent...
start "Game Master Agent" cmd /k "cd backend && uv run python src/agent.py dev"
echo Waiting for agent to initialize...
timeout /t 3 /nobreak >nul

REM Start frontend
echo [3/3] Starting frontend...
start "Frontend" cmd /k "cd frontend && pnpm dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo LiveKit Server: ws://127.0.0.1:7880
echo Frontend: http://localhost:3000
echo.
echo ========================================
echo.
echo IMPORTANT:
echo 1. Wait for all 3 windows to finish loading
echo 2. Open http://localhost:3000 in your browser
echo 3. Click "Connect" and allow microphone
echo 4. The Game Master will greet you!
echo.
echo ========================================
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping all services...
taskkill /FI "WINDOWTITLE eq LiveKit Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Game Master Agent*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul 2>&1
echo All services stopped.
pause
