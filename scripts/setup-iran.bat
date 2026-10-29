@echo off
REM ============================================================
REM setup-iran.bat - One-click Windows launcher for setup-iran.ps1
REM ------------------------------------------------------------
REM It bypasses the PowerShell ExecutionPolicy automatically, so
REM you never see "running scripts is disabled on this system".
REM
REM Usage (from repo root, or double-click this file):
REM   scripts\setup-iran.bat            ^(setup mirror + run dsh^)
REM   scripts\setup-iran.bat -Restore   ^(restore official registry^)
REM
REM With a proxy (set it first in the same window):
REM   set PROXY=http://127.0.0.1:8118
REM   scripts\setup-iran.bat
REM ============================================================
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-iran.ps1" %*
