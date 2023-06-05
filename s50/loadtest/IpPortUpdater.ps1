param (
    [Parameter(Mandatory = $true)]
    [string]
    $TestPlan = "",
    [string]
    $OldIp = "",
    [string]
    $OldPort = "",
    [string]
    $NewIp = "",
    [string]
    $NewPort = "",
    [string]
    $OutPath = "",
    [switch]
    $Https
)

if (-not (Test-Path $TestPlan)) {
    throw $TestPlan + " can not be found"; 
}

$TestPlanAbsolute = Resolve-Path -Path $TestPlan;

$xml = New-Object xml
$xml.PreserveWhitespace = $true
$xml.Load($TestPlanAbsolute)

Select-Xml -Xml $xml -XPath "//stringProp" | foreach {

    if (![string]::IsNullOrEmpty($OldIp)) {
        if ($_.node.InnerText.Equals($OldIp)) {
            $_.node.InnerText = $NewIp;
        }
    }

    if (![string]::IsNullOrEmpty($OldPort)) {
        if ($_.node.InnerText.Equals($OldPort)) {
            $_.node.InnerText = $NewPort;
        }
    }

    if ($Https) {
        if ($_.node.InnerText.Equals("http")) {
            $_.node.InnerText = "https";
        }
    }
    else {
        if ($_.node.InnerText.Equals("https")) {
            $_.node.InnerText = "http";
        }
    }
}

if (![string]::IsNullOrEmpty($OutPath)) {
    Write-Host "Modified test plan saved to " $OutPath;
    $xml.Save($OutPath);
}
else {
    Write-Host "Modified test plan saved to " $TestPlanAbsolute;
    $xml.Save($TestPlanAbsolute);
}