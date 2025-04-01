#
# Automatically generates report.htm if any .ts files change
#

$Last = $null
while ($true) {
    $Now = Get-ChildItem -Recurse -Path "$PsScriptRoot\.." -Filter '*.ts' | `
        Select-Object Name, @{Name="LastWriteTime";Expression={$_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss") }} | 
        out-string
    if ($Last -ne $Now) {
        & deno --unstable-sloppy-imports "$PsScriptRoot\generate_test_report.ts" > "$PsScriptRoot\report.htm"
    }
    $Last = $Now
    Start-Sleep 1
}
