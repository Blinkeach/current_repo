@echo off
cls
echo.
echo ========================================
echo   DELHIVERY FIX APPLIED
echo ========================================
echo.
echo The .env file has been updated with the correct warehouse name:
echo   DELHIVERY_PICKUP_LOCATION=Blink Each
echo.
echo ========================================
echo   RESTARTING SERVER
echo ========================================
echo.
echo Press Ctrl+C to stop the server when you're done testing
echo.
pause
echo.
echo Starting server...
echo.
npm run dev