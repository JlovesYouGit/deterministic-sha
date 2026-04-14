@echo off
REM Activate Gate Watchdog Auto-Execute (Windows)
REM This script sets a persistent boolean flag that activates the watchdog sequence

setlocal

set "SCRIPT_DIR=%~dp0"
set "CONFIG_FILE=protocol\watchdog-config.json"
set "CONFIG_PATH=%SCRIPT_DIR%%CONFIG_FILE%"

if "%1"=="activate" goto activate
if "%1"=="on" goto activate
if "%1"=="enable" goto activate
if "%1"=="start" goto activate

if "%1"=="deactivate" goto deactivate
if "%1"=="off" goto deactivate
if "%1"=="disable" goto deactivate
if "%1"=="stop" goto deactivate

if "%1"=="status" goto status
if "%1"=="check" goto status

goto usage

:activate
if not exist "%SCRIPT_DIR%protocol\" mkdir "%SCRIPT_DIR%protocol\"

(
echo {
echo   "watchdogAutoExecute": true,
echo   "activatedAt": %time:~0,2%%time:~3,2%%time:~6,2%,
echo   "activatedBy": "%USERNAME%",
echo   "persistent": true,
echo   "version": "1.0.0"
echo }
) > "%CONFIG_PATH%"

echo [SUCCESS] Gate Watchdog auto-execute ACTIVATED
echo   Config file: %CONFIG_PATH%
echo   Activated at: %DATE% %TIME%
echo   Activated by: %USERNAME%
echo   Persistent: true
echo.
echo The watchdog sequence will now auto-execute on every boot.
echo No further user intervention or terminal runs required.
echo This setting will persist even after device reboots.
goto end

:deactivate
if not exist "%CONFIG_PATH%" (
    echo Config file not found. Watchdog is not activated.
    goto end
)

(
echo {
echo   "watchdogAutoExecute": false,
echo   "activatedAt": null,
echo   "activatedBy": null,
echo   "persistent": true,
echo   "version": "1.0.0"
echo }
) > "%CONFIG_PATH%"

echo [SUCCESS] Gate Watchdog auto-execute DEACTIVATED
echo   Config file: %CONFIG_PATH%
echo   Deactivated at: %DATE% %TIME%
goto end

:status
if not exist "%CONFIG_PATH%" (
    echo Status: NOT ACTIVATED (config file not found)
    goto end
)

findstr /C:"\"watchdogAutoExecute\": true" "%CONFIG_PATH%" >nul
if %errorlevel%==0 (
    echo Status: ACTIVATED
) else (
    echo Status: NOT ACTIVATED
)
goto end

:usage
echo Usage: %~nx0 {activate^|deactivate^|status}
echo.
echo Commands:
echo   activate   - Activate watchdog auto-execute (persistent)
echo   deactivate - Deactivate watchdog auto-execute
echo   status     - Check current activation status
echo.
echo Examples:
echo   %~nx0 activate    # Activate (will persist across reboots)
echo   %~nx0 deactivate  # Deactivate
echo   %~nx0 status      # Check status
exit /b 1

:end
endlocal

