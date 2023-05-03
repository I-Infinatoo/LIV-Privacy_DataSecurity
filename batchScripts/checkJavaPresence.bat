@echo off
@REM Will check for the presence of JAVA in the system. If not present then create a pop-up to get it installed 
rem Check if Java is installed
java -version >nul 2>&1
if %errorlevel% equ 0 (
    rem Java is installed
    java -version
) else (
    rem Java is not installed, download and install Java 11
    echo Java is not installed, downloading and installing Java 11...
    powershell -Command "& { Invoke-WebRequest -Uri 'https://javadl.oracle.com/webapps/download/AutoDL?BundleId=244545_89d678f2be164786b292527658ca1605' -OutFile 'jre-11.0.13_windows-x64_bin.exe' }"
    start /wait jre-11.0.13_windows-x64_bin.exe /s ADDLOCAL="FeatureEnvironment,FeatureJavaHome" JAVAUPDATE=0 AUTO_UPDATE=0 EULA=0 REBOOT=0
    echo Java 11 has been installed.
)