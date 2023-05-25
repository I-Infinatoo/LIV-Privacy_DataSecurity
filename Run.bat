@echo off

@REM REM Check for Java
java -version 2>nul
if %errorlevel% neq 0 (
    echo Java is not available
    exit /b
) else (
    @REM echo Java is available
)

@REM REM Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not available
    exit /b
) else (
    @REM echo Node.js is available
    npm i
    npm run start
)