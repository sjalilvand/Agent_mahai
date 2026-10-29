@echo off
REM ============================================================
REM setup-iran.bat - MahAI root launcher (Mah Afzar Hooshmand Rasa Co.)
REM ------------------------------------------------------------
REM Convenience stub so you can start MahAI from the repo root
REM (.\setup-iran.bat) or by double-clicking this file in Explorer.
REM It simply forwards to scripts\setup-iran.bat.
REM
REM Usage:
REM   .\setup-iran.bat            ^(setup mirror + Persian skin + run dsh^)
REM   .\setup-iran.bat -Restore   ^(restore official npm registry^)
REM
REM With a proxy (set it first in the same window):
REM   set PROXY=http://127.0.0.1:8118
REM   .\setup-iran.bat
REM ============================================================
"%~dp0scripts\setup-iran.bat" %*
