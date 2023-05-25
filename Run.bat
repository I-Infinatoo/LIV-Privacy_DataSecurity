@echo off

REM Check for Java
java -version 2>nul
if %errorlevel% neq 0 (
    echo Java is not available
    exit /b
) else (
    echo Java is available
)

REM Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not available
    exit /b
) else (
    echo Node.js is available
    npm i
    npm run dev
)