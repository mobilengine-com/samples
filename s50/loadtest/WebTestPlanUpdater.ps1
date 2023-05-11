param (
    [Parameter(Mandatory = $true)]
    [string]
    $TestPlan = "",
    #The username of the user used under recording
    [string]
    $Usern = "",
    #The password of the user used under recording
    [string]
    $Password = "",
    [string]
    $OutPath = ""
)

if (-not (Test-Path $TestPlan)) {
    throw $TestPlan + " can not be found"; 
}

$TestPlanAbsolute = Resolve-Path -Path $TestPlan;

$xml = New-Object xml
$xml.PreserveWhitespace = $true
$xml.Load($TestPlanAbsolute)

#$xml | Out-String | Write-Host

$GuidMetadataSet = New-Object System.Collections.Generic.HashSet[string]

Select-Xml -Xml $xml -XPath "//elementProp[@name='daqrkeys']" | foreach {
    $GuidMetadataSet.Add($_.node.stringProp[1].InnerText.Substring(0, 32)) | Out-Null;
}

Select-Xml -Xml $xml -XPath "//elementProp[@name='__RequestVerificationToken']" | foreach {
    $_.node.stringProp[1].InnerText = '${token}';
}

Select-Xml -Xml $xml -XPath "//elementProp[@name='X-XSRF-TOKEN']" | foreach {
    $_.node.stringProp[1].InnerText = '${COOKIE_XSRF-TOKEN}';
}

#guidrdt in fprocessed param
Select-Xml -Xml $xml -XPath "//elementProp[@name='guidRdt']" | foreach {
    $_.node.stringProp[1].InnerText = '${guid}';
}

Select-Xml -Xml $xml -XPath "//stringProp" | foreach {
    <#if([string]::IsNullOrEmpty($_.node.InnerText)) {
        Write-Host($_.node);
        continue;
    }#>

    if ($_.node.InnerXml -match '"Wesid":(\d+),') {
        $Wesid = $matches[1];
        $_.node.InnerXml = $_.node.InnerXml.Replace('"Wesid":' + $Wesid, '"Wesid":"${wesid_g1}"');
    }

    if ($_.node.InnerXml -match '"IdMetadata":(\d+),') {
        $Wesid = $matches[1];
        $_.node.InnerXml = $_.node.InnerXml.Replace('"IdMetadata":' + $Wesid, '"IdMetadata":${idMetadata_g1}');
    }

    #guidrdt in submit body data
    if ($_.node.InnerXml -match '"GuidRdt":"([a-f0-9]{32})"') {
        $Guid = $matches[1];
        $_.node.InnerXml = $_.node.InnerXml.Replace('"GuidRdt":"' + $Guid, '"GuidRdt":"${guid}');
    }

    foreach ($GuidMetadata in $GuidMetadataSet) {
        if ($_.node.InnerText.Contains($GuidMetadata)) {
            $_.node.InnerText = $_.node.InnerText.Replace($GuidMetadata, '${guidMetadata_g1}');
        }
    }

    if (![string]::IsNullOrEmpty($Usern)) {
        if ($_.node.InnerText.Equals($Usern)) {
            $_.node.InnerText = $_.node.InnerText.Replace($Usern, '${username}');
        }
    }

    if (![string]::IsNullOrEmpty($Password)) {
        if ($_.node.InnerText.Equals($Password)) {
            $_.node.InnerText = $_.node.InnerText.Replace($Password, '${password}');
        }
    }
}

if (![string]::IsNullOrEmpty($OutPath)) {
    Write-Host "Modified test plan saved to " $OutPathAbsolute;
    $xml.Save($OutPathAbsolute);
}
else {
    Write-Host "Modified test plan saved to " $TestPlanAbsolute;
    $xml.Save($TestPlanAbsolute);
}