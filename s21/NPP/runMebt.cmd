@echo off

SET MEBT_PASSWORD=wapaja.115
SET MEBT_SERVICEURL=http://localhost:8081/Services/Comex
SET MEBT_USER=su
SET MEBT_PATH=c:\work\projects\ME-server\trunk\MobileServer\ComexClient\bin\Debug

cd %1
for %%F in ("%cd%") do set "folder=%%~nxF"
%MEBT_PATH%\Mebt.exe run --no-header -c %folder% . rtab.xlsx
