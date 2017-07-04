# ps ad commands: https://technet.microsoft.com/en-us/library/ee617195.aspx

for ($i=200; $i -lt 300; $i++) { 
	$usern = "testuser"+$i 
	New-ADUser -name $usern -userprincipalname ($usern + "@meadfstest.local") -DisplayName ("Test User " + $i) -EmailAddress ("dev+testuser" + $i + "@mobilengine.com") -MobilePhone ("+3632112" + $i)
	Set-ADAccountPassword $usern -newpassword (ConvertTo-SecureString -AsPlainText "Vujmag16" -Force)
	Add-ADGroupMember mobilengine $usern
}
