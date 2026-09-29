# Builds dist\signpost.html: the whole app in one file for the claude.ai artifact.
# The artifact host wraps the file in its own <html><head><body>, so this file starts with <title> and <style>.
# Fonts come from Google Fonts there (the artifact host allows that origin); the hosted app uses fonts\ instead.
# Usage (PowerShell):  & ".\build.ps1"
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$read = { param($p) [IO.File]::ReadAllText((Join-Path $root $p), [Text.Encoding]::UTF8) }
$css = & $read 'src\base.css'
$js = (& $read 'src\data.js') + "`n" + (& $read 'src\data-adhd.js') + "`n" + (& $read 'src\data-narc.js') + "`n" + (& $read 'src\score.js') + "`n" + (& $read 'src\app.js')
if ($js -match '</script') { throw 'A script contains </script, which would end the inline script early.' }
$html = @'
<title>Signpost</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400..700&family=Bitter:wght@500..700&display=swap">
<style>
'@ + $css + @'
</style>
<div id="app"></div>
<script>
'@ + $js + @'
</script>
'@
New-Item -ItemType Directory -Force (Join-Path $root 'dist') | Out-Null
$out = Join-Path $root 'dist\signpost.html'
[IO.File]::WriteAllText($out, $html, $utf8)
'wrote {0} ({1:N0} bytes)' -f $out, (Get-Item $out).Length
