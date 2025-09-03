param (
    [Parameter(Mandatory = $true)]
    [string]$FilePath
)

$BitsInLastCell = 32
$Shift = 11
$WidthInBits = 160

$data = @(0..2 | ForEach-Object { [UInt64]0 })
$lengthSoFar = 0
$shiftSoFar = 0

$AbsolutePath = Resolve-Path $FilePath
$buffer = [System.IO.File]::ReadAllBytes($AbsolutePath)
$lengthSoFar = $buffer.Length

$ibStart = 0
$cbSize = $buffer.Length

$currentShift = $shiftSoFar
$vectorArrayIndex = [math]::Floor($currentShift / 64)
$vectorOffset = $currentShift % 64
$iterations = [math]::Min($cbSize, $WidthInBits)

for ($i = 0; $i -lt $iterations; $i++) {
    $isLastCell = $vectorArrayIndex -eq ($data.Length - 1)
    $bitsInVectorCell = if ($isLastCell) { $BitsInLastCell } else { 64 }

    if ($vectorOffset -le ($bitsInVectorCell - 8)) {
        for ($j = $ibStart + $i; $j -lt ($cbSize + $ibStart); $j += $WidthInBits) {
            $data[$vectorArrayIndex] = $data[$vectorArrayIndex] -bxor ([UInt64]$buffer[$j] -shl $vectorOffset)
        }
    }
    else {
        $index1 = $vectorArrayIndex
        $index2 = if ($isLastCell) { 0 } else { ($vectorArrayIndex + 1) }
        $low = $bitsInVectorCell - $vectorOffset

        $xoredByte = 0
        for ($j = $ibStart + $i; $j -lt ($cbSize + $ibStart); $j += $WidthInBits) {
            $xoredByte = $xoredByte -bxor $buffer[$j]
        }

        $data[$index1] = $data[$index1] -bxor ([UInt64]$xoredByte -shl $vectorOffset)
        $data[$index2] = $data[$index2] -bxor ([UInt64]$xoredByte -shr $low)
    }

    $vectorOffset += $Shift
    while ($vectorOffset -ge $bitsInVectorCell) {
        $vectorArrayIndex = if ($isLastCell) { 0 } else { ($vectorArrayIndex + 1) }
        $vectorOffset -= $bitsInVectorCell
    }
}

$shiftSoFar = ($shiftSoFar + $Shift * ($cbSize % $WidthInBits)) % $WidthInBits

# Finalize hash
$rgb = New-Object byte[] 20
for ($i = 0; $i -lt $data.Length - 1; $i++) {
    [System.Buffer]::BlockCopy([BitConverter]::GetBytes($data[$i]), 0, $rgb, $i * 8, 8)
}

$lastIndex = ($data.Length - 1)
[System.Buffer]::BlockCopy([BitConverter]::GetBytes($data[$lastIndex]), 0, $rgb, $lastIndex * 8, $rgb.Length - ($lastIndex * 8))

$lengthBytes = [BitConverter]::GetBytes([Int64]$lengthSoFar)
for ($i = 0; $i -lt $lengthBytes.Length; $i++) {
    $rgb[($WidthInBits / 8) - $lengthBytes.Length + $i] = $rgb[($WidthInBits / 8) - $lengthBytes.Length + $i] -bxor $lengthBytes[$i]
}

[Convert]::ToBase64String($rgb)