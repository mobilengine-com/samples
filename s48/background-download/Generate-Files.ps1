#
# Generates a files dir with 100 5MB pdf files.
# 
# Also generates an XLSX file, that you need to open and save 
# to convert to a proper XLSX format before uploading.
#

$SamplePdf = "$PSScriptRoot\sample.pdf"
if (-not (Test-Path $SamplePdf)) {
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest `
        -Uri "https://mobilengine.com/wp-content/uploads/2015/03/Mobilengine_casestudy_ProconX_2015_redesign.pdf" `
        -OutFile "$PSScriptRoot\sample.pdf"
}

$FilesDir = "$PSScriptRoot\files"
Remove-Item -Force -Recurse -ErrorAction Ignore $FilesDir
New-Item -ItemType Directory $FilesDir | Out-Null
$Refdata = '<?xml version="1.0" encoding="UTF-8"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="https://www.w3.org/TR/html401/">
    <Worksheet ss:Name="files">
    <Table>
    <Column ss:Index="1" ss:AutoFitWidth="0" ss:Width="110"/>
    <Row>
    <Cell><Data ss:Type="String">Id</Data></Cell>
    <Cell><Data ss:Type="String">Fileref</Data></Cell>
    </Row>
'
for ($i = 0; $i -lt 100; $i += 1) {
    $Guid = [guid]::NewGuid().ToString("N")
    $Refdata += "
        <Row>
        <Cell><Data ss:Type='Number'>$i</Data></Cell>
        <Cell><Data ss:Type='String'>$Guid|$i</Data></Cell>
        </Row>
    "    
    Copy-Item $SamplePdf "$FilesDir\$($Guid)_sample.pdf"
}
$Refdata += '
    </Table>
    </Worksheet>
    </Workbook>
'

Set-Content -Encoding UTF8 -Value $Refdata "$PSScriptRoot\rtab.xlsx"
