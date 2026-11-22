$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$target = Get-ChildItem -LiteralPath 'D:\jiuguangji-shop' -Filter '*.doc' |
    Where-Object { -not $_.Name.Contains([string][char]0xFF08) } |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($null -eq $target) { throw 'No target document found' }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($target.FullName, $false, $true, $false)
    Write-Output ('FILE=' + $target.FullName)
    Write-Output ('PARAGRAPHS=' + $doc.Paragraphs.Count)
    for ($i = 59; $i -le 100; $i++) {
        if ($i -gt $doc.Paragraphs.Count) { break }
        $p = $doc.Paragraphs.Item($i)
        $t = $p.Range.Text -replace "[\r\n\a\t]", ' '
        if ($t.Length -gt 80) { $t = $t.Substring(0, 80) }
        Write-Output ('T[' + $i + '] style=' + $p.Style.NameLocal + ' | ' + $t)
    }
    $doc.Close($false)
}
finally {
    try { $word.Quit() } catch {}
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
