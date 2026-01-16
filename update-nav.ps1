# PowerShell script to update navbar across all HTML files
$files = @(
    "index.html",
    "kenvision.html",
    "keniot.html",
    "kenrobotics.html",
    "kenagri.html",
    "kenhome.html",
    "kensafety.html",
    "ken360.html",
    "about.html",
    "blogs.html",
    "contact.html",
    "faq.html",
    "privacy.html",
    "terms.html"
)

Write-Host "Files to update: $($files.Count)"
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ Found: $file"
    } else {
        Write-Host "✗ Missing: $file"
    }
}
