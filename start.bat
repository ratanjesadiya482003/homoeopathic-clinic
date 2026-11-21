@echo off
title  Homoeopathy Central Multi-User Clinic System
echo =======================================================
echo Starting  Homoeopathy Central Multi-User Clinic Server...
echo =======================================================
start http://localhost:3000
call npm.cmd run dev
pause
