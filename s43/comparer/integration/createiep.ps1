param([String]$ComexUrl, [Int32]$companyId, [String]$usern, [String]$pwd)

function GetAuthHeaders() {
    $Pair = $usern + ":" + $pwd
    $Bytes = [System.Text.Encoding]::ASCII.GetBytes($Pair)
    $Base64 = [System.Convert]::ToBase64String($Bytes)
    @{
        Authorization = "Basic $Base64"
    }
}
$Auth = GetAuthHeaders

function CreateIepIn($companyId, $iepn) {
	$body = ConvertTo-Json @{
        companyId = $companyId;
		kiep = "Wdi";
        iepn = $iepn
    }
    $res = Invoke-RestMethod -Uri "$ComexUrl/v1/cman/iep" -Method PUT -Headers $Auth -ContentType "application/json" -Body $body
	if ($res.resultCode -ne 0) {
		throw "Error creating iep: $res"
	}
}

function CreateIepOut($companyId, $iepn, $url) {
	$body = ConvertTo-Json @{
        companyId = $companyId;
		kiep = "Wdo";
        iepn = $iepn;
		url = $url
    }
    $res = Invoke-RestMethod -Uri "$ComexUrl/v1/cman/iep" -Method PUT -Headers $Auth -ContentType "application/json" -Body $body
	if ($res.resultCode -ne 0) {
		throw "Error creating iep: $res"
	}
	
}
function CreateIepRdtbin($companyId, $iepn) {
	$body = ConvertTo-Json @{
        companyId = $companyId;
		kiep = "Rdtbin";
        iepn = $iepn;
    }
    $res = Invoke-RestMethod -Uri "$ComexUrl/v1/cman/iep" -Method PUT -Headers $Auth -ContentType "application/json" -Body $body
	if ($res.resultCode -ne 0) {
		throw "Error creating iep: $res"
	}
	
}
Write-Output "--- Create ieps -------------------"
Write-Output "param " $ComexUrl $companyId $usern $pwd

CreateIepIn $companyId "in"
CreateIepIn $companyId "inExtUser"
CreateIepIn $companyId "inSetupUsr"
CreateIepOut $companyId "out" "http://alma.hu"
CreateIepOut $companyId "outExtUser" "http://alma.hu"

