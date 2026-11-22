$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$src = (Get-ChildItem -LiteralPath 'D:\jiuguangji-shop' -Filter '*.doc' | Select-Object -First 1).FullName
$insertDoc = 'D:\jiuguangji-shop\tools\chapter3_insert.docx'
$backupDir = 'D:\jiuguangji-shop\tools\backup'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = Join-Path $backupDir ('thesis_template_backup_' + $stamp + '.doc')
Copy-Item -LiteralPath $src -Destination $backup -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $null

try {
    try {
        $doc = $word.Documents.Open(
            $src, $false, $false, $false,
            [Type]::Missing, [Type]::Missing, $false,
            [Type]::Missing, [Type]::Missing,
            0, 0, $false, $true
        )
    } catch {
        $doc = $word.Documents.Open($src, $false, $false, $false)
    }
    if ($null -eq $doc) { throw 'Cannot open document' }

    $chap3Idx = -1
    $chap4Idx = -1
    $count = $doc.Paragraphs.Count
    $di = [string][char]0x7B2C
    $zhang = [string][char]0x7AE0
    $prefix3 = $di + '3' + $zhang
    $prefix4 = $di + '4' + $zhang
    for ($i = 1; $i -le $count; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $text = $p.Range.Text -replace "[\r\n\a\t]", ''
        if ($p.OutlineLevel -eq 1 -and $text.StartsWith($prefix3)) { $chap3Idx = $i }
        if ($p.OutlineLevel -eq 1 -and $text.StartsWith($prefix4)) { $chap4Idx = $i; break }
    }
    if ($chap3Idx -lt 1 -or $chap4Idx -lt 1) { throw 'Chapter headings not found' }

    $start = $doc.Paragraphs.Item($chap3Idx).Range.Start
    $end = $doc.Paragraphs.Item($chap4Idx).Range.Start
    $range = $doc.Range($start, $end)
    $range.Delete()

    $insertRange = $doc.Range($start, $start)
    $insertRange.InsertFile($insertDoc)

    $doc.Repaginate()
    if ($doc.TablesOfContents.Count -ge 1) {
        $doc.TablesOfContents.Item(1).Update()
    }
    $doc.Save()

    Write-Output ('BACKUP=' + $backup)
    Write-Output ('PARAGRAPHS=' + $doc.Paragraphs.Count)
    Write-Output ('TABLES=' + $doc.Tables.Count)
    Write-Output ('INLINESHAPES=' + $doc.InlineShapes.Count)
    Write-Output ('TOC_COUNT=' + $doc.TablesOfContents.Count)

    $doc.Close($false)
    $doc = $null

    $desiredName = $src.Substring($src.LastIndexOf('\') + 1).Replace([string][char]0xFF08, '')
    $copyPath = Join-Path $src.Substring(0, $src.LastIndexOf('\')) $desiredName
    Copy-Item -LiteralPath $src -Destination $copyPath -Force
    Write-Output ('COPY=' + $copyPath)
}
finally {
    try { if ($null -ne $doc) { $doc.Close($false) } } catch {}
    try { $word.Quit() } catch {}
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
