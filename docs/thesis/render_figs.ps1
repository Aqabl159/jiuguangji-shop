# 将 figures/*.svg 通过 Edge headless 渲染为同尺寸 PNG（渲染工具脚本，非论文内容）
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dir = 'D:\jiuguangji-shop\docs\thesis\figures'
$profile = Join-Path $env:TEMP 'edge_thesis_profile'

$figs = @(
  @{name='fig3-1'; w=1500; h=800},
  @{name='fig3-2'; w=1500; h=800},
  @{name='fig3-3'; w=1500; h=950},
  @{name='fig3-4'; w=1500; h=950},
  @{name='fig3-5'; w=1200; h=1460},
  @{name='fig3-6'; w=1200; h=1380},
  @{name='fig3-7'; w=1600; h=1100},
  @{name='fig3-8'; w=1600; h=1080},
  @{name='fig3-9'; w=1560; h=1000},
  @{name='fig3-10'; w=1900; h=1150}
)

foreach ($f in $figs) {
  $html = Join-Path $dir ($f.name + '.html')
  $svg  = $f.name + '.svg'
  $png  = Join-Path $dir ($f.name + '.png')
  $body = @"
<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}</style></head>
<body><img src="$svg" width="$($f.w)" height="$($f.h)"></body></html>
"@
  Set-Content -Path $html -Value $body -Encoding utf8
  $url = 'file:///' + ($html -replace '\\','/')
  & $edge --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --window-size=$($f.w),$($f.h) --virtual-time-budget=3000 `
    --user-data-dir=$profile --screenshot=$png $url | Out-Null
  if (Test-Path $png) {
    Write-Output ("OK  " + $f.name + "  " + (Get-Item $png).Length + " bytes")
  } else {
    Write-Output ("FAIL " + $f.name)
  }
}
