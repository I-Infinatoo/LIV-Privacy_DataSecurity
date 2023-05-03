@echo off
@REM this version of script will only check for the java version in the system
echo Checking Java version...

java -version > java_version.txt

findstr /i "version" java_version.txt > nul

if %errorlevel% equ 0 (
    echo Java is already installed.
    type java_version.txt
) else (
    echo Java is not installed. Downloading Java 11 from Oracle...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://download.oracle.com/java/11/latest/jdk-11.0.13_windows-x64_bin.exe', 'jdk-11.0.13_windows-x64_bin.exe')"
    if %errorlevel% neq 0 (
        echo Failed to download Java.
    ) else (
        echo Installing Java 11...
        jdk-11.0.13_windows-x64_bin.exe /s
        if %errorlevel% neq 0 (
            echo Failed to install Java.
        ) else (
            echo Java 11 has been installed successfully.
        )
    )
)

pause