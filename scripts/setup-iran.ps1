# ============================================================
# setup-iran.ps1 — اسکریپت بومی‌سازی ایران برای ویندوز
# DeepSeek Harness (dsh)
# ------------------------------------------------------------
# استفاده (در PowerShell):
#   powershell -ExecutionPolicy Bypass -File scripts\setup-iran.ps1
#   با پروکسی:  $env:PROXY="http://127.0.0.1:8118"; .\scripts\setup-iran.ps1
#   برگشت:      powershell -ExecutionPolicy Bypass -File scripts\setup-iran.ps1 -Restore
# ============================================================
param(
    [switch]$Restore
)

$IranMirror = "https://registry.npmjs.ir/"
$Official   = "https://registry.npmjs.org/"

function Write-Log($msg)  { Write-Host "[Agent_mahai]" -ForegroundColor Green -NoNewline; Write-Host " $msg" }
function Write-Err($msg)  { Write-Host "[خطا]" -ForegroundColor Red   -NoNewline; Write-Host " $msg" }

Write-Host "============================================================"
Write-Host "  بومی‌سازی ایران برای DeepSeek Harness (dsh)"
Write-Host "  https://github.com/sjalilvand/Agent_mahai"
Write-Host "============================================================"

# ---------- حالت برگشت ----------
if ($Restore) {
    Write-Log "برگشت رجیستری npm به حالت رسمی…"
    npm config set registry $Official
    Write-Log "انجام شد."
    exit 0
}

# ---------- ۱) بررسی Node.js ----------
try {
    $nodeVersion = (node --version) 2>$null
} catch {
    Write-Err "Node.js نصب نیست یا در PATH نیست. نسخه ۲۰+ را نصب کنید (docs-fa/02)."
    exit 1
}
$nodeMajor = [int]($nodeVersion -replace '^v','' -split '\.')[0]
if ($nodeMajor -lt 20) {
    Write-Err "نسخه Node.js ($nodeVersion) قدیمی است؛ نسخه ۲۰ یا بالاتر لازم است."
    exit 1
}
Write-Log "Node.js نسخه $nodeVersion ✓"

# ---------- ۲) تنظیم میرور ----------
Write-Log "تنظیم میرور ایرانی npm: $IranMirror"
npm config set registry $IranMirror
Write-Log "میرور برای npm تنظیم شد ✓"

# ---------- ۳) پروکسی (اختیاری) ----------
if ($env:PROXY) {
    Write-Log "تنظیم پروکسی روی $($env:PROXY)"
    $env:HTTP_PROXY  = $env:PROXY
    $env:HTTPS_PROXY = $env:PROXY
    $env:NO_PROXY    = "localhost,127.0.0.1,registry.npmjs.ir"
}

# ---------- ۴) اجرای dsh ----------
Write-Log "همه تنظیمات انجام شد. اجرای dsh web…"
Write-Host ""
Write-Host "  دستور: npx @deepseek-ai/dsh web"
Write-Host "  آدرس پس از اجرا: http://127.0.0.1:3080"
Write-Host ""
npx -y "@deepseek-ai/dsh" web
