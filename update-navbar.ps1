# PowerShell script to copy navbar from kenvision.html to other product pages
# This script will extract the navbar section and apply it to all product pages

$pages = @(
    @{file="keniot.html"; active="keniot.html"},
    @{file="kenrobotics.html"; active="kenrobotics.html"},
    @{file="kenagri.html"; active="kenagri.html"},
    @{file="kenhome.html"; active="kenhome.html"},
    @{file="kensafety.html"; active="kensafety.html"}
)

Write-Host "Navbar update script ready"
Write-Host "Files to update: $($pages.Count)"
