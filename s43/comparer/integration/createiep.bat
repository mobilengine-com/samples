rem Dbfairy.exe -iep:in -kiep:Wdi -key c66bf4c3fcbe4934bc0b3315b1dcac3e -company Gringotts
rem Dbfairy.exe -iep:inExtUser -kiep:Wdi -key c66bf4c3fcbe4934bc0b3315b1dcac40 -company Gringotts
rem Dbfairy.exe -iep:out -kiep:Wdo -key c66bf4c3fcbe4934bc0b3315b1dcac3f -company Gringotts -url http://alma.hu
rem Dbfairy.exe -iep:outExtUser -kiep:Wdo -key c66bf4c3fcbe4934bc0b3315b1dcac41 -company Gringotts -url http://alma.hu
powershell .\createiep.ps1 $env:MEBT_SERVICEURL %1 $env:MEBT_USER $env:MEBT_PASSWORD
