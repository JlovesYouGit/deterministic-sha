@echo off
title Unified Miner - Persistent Launcher
echo Starting Unified Miner in background...
cd /d "%~dp0ScryptMineOS"
start /b pythonw continuous_miner.py
echo.
echo Miner launched in hidden background mode (pythonw).
echo Check continuous_mining_status.json for status.
pause
