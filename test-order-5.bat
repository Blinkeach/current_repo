@echo off
echo.
echo ========================================
echo   TESTING ORDER #5 - DELHIVERY FIX
echo ========================================
echo.
echo [1/3] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo [2/3] Starting server with address parser fix...
echo.
echo ----------------------------------------
echo   Server is starting...
echo   Watch for Order #5 shipment logs
echo ----------------------------------------
echo.
start cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo [3/3] Opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:5000
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Wait for server to start (check new window)
echo 2. Login to admin panel
echo 3. Go to Orders section
echo 4. Find Order #5
echo 5. Change status to "Shipped"
echo 6. Watch the server console for success!
echo.
echo Expected Success Message:
echo   "SHIPMENT CREATED SUCCESSFULLY"
echo   "Tracking ID: [Delhivery Number]"
echo.
echo ========================================
echo.
pause