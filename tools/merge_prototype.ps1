$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$src = (Get-ChildItem -LiteralPath 'D:\jiuguangji-shop' -Filter '*.doc' | Select-Object -First 1).FullName
$outDir = 'D:\jiuguangji-shop\tools\out'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$testDoc = Join-Path $outDir ('merge_test_' + $stamp + '.doc')
$testOut = $testDoc
Copy-Item -LiteralPath $src -Destination $testDoc -Force

$insertDoc = 'D:\jiuguangji-shop\tools\chapter3_insert.docx'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $null
    try {
        $doc = $word.Documents.Open(
            $testDoc, $false, $false, $false,
            [Type]::Missing, [Type]::Missing, $false,
            [Type]::Missing, [Type]::Missing,
            0, 0, $false, $true
        )
    } catch {
        $doc = $word.Documents.Open($testDoc, $false, $false, $false)
    }
    if ($null -eq $doc) { throw 'Cannot open test document' }

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
    Write-Output ('CHAP3_IDX=' + $chap3Idx + ' CHAP4_IDX=' + $chap4Idx)
    if ($chap3Idx -lt 1 -or $chap4Idx -lt 1) { throw 'Chapter headings not found' }

    $start = $doc.Paragraphs.Item($chap3Idx).Range.Start
    $end = $doc.Paragraphs.Item($chap4Idx).Range.Start
    $range = $doc.Range($start, $end)
    $deletedText = $range.Text
    $range.Delete()
    Write-Output ('DELETED_CHARS=' + $deletedText.Length)

    $insertRange = $doc.Range($start, $start)
    $insertRange.InsertFile($insertDoc)
    Write-Output ('AFTER_INSERT_PARAGRAPHS=' + $doc.Paragraphs.Count)
    Write-Output ('AFTER_INSERT_TABLES=' + $doc.Tables.Count)
    Write-Output ('AFTER_INSERT_INLINESHAPES=' + $doc.InlineShapes.Count)
    Write-Output ('TOC_COUNT=' + $doc.TablesOfContents.Count)
    $doc.Repaginate()
    if ($doc.TablesOfContents.Count -ge 1) {
        $doc.TablesOfContents.Item(1).Update()
    }

    $doc.Save()
    Write-Output ('SAVED=' + $testOut)
    $doc.Close($false)

    $check = $word.Documents.Open($testOut, $false, $true, $false)
    $count2 = $check.Paragraphs.Count
    $di = [string][char]0x7B2C
    $zhang = [string][char]0x7AE0
    $prefix3 = $di + '3' + $zhang
    $prefix4 = $di + '4' + $zhang
    $c3 = -1
    $c4 = -1
    for ($i = 1; $i -le $count2; $i++) {
        $p = $check.Paragraphs.Item($i)
        $t = $p.Range.Text -replace "[\r\n\a\t]", ''
        if ($p.OutlineLevel -eq 1 -and $t.StartsWith($prefix3)) { $c3 = $i }
        if ($p.OutlineLevel -eq 1 -and $t.StartsWith($prefix4)) { $c4 = $i; break }
    }
    Write-Output ('CHECK_PARAGRAPHS=' + $count2 + ' CHAP3=' + $c3 + ' CHAP4=' + $c4)
    if ($c3 -gt 0) {
        $end = [Math]::Min($c3 + 6, $count2)
        for ($i = $c3; $i -le $end; $i++) {
            $p = $check.Paragraphs.Item($i)
            $t = $p.Range.Text -replace "[\r\n\a\t]", ' '
            if ($t.Length -gt 60) { $t = $t.Substring(0, 60) }
            Write-Output ('P[' + $i + '] style=' + $p.Style.NameLocal + ' | ' + $t)
        }
    }
    if ($c4 -gt 0) {
        $lo = [Math]::Max($c4 - 3, 1)
        $hi = [Math]::Min($c4 + 2, $count2)
        for ($i = $lo; $i -le $hi; $i++) {
            $p = $check.Paragraphs.Item($i)
            $t = $p.Range.Text -replace "[\r\n\a\t]", ' '
            if ($t.Length -gt 60) { $t = $t.Substring(0, 60) }
            Write-Output ('Q[' + $i + '] style=' + $p.Style.NameLocal + ' | ' + $t)
        }
    }
    $check.Close($false)
}
finally {
    try { if ($null -ne $doc) { $doc.Close($false) } } catch {}
    try { $word.Quit() } catch {}
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
