# ============================================================
# setup-iran.ps1 — اسکریپت راه‌اندازی ماه‌ای برای ویندوز (شرکت ماه‌افزار هوشمند رسا)
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

function Write-Log($msg)  { Write-Host "[ماه‌ای]" -ForegroundColor Green -NoNewline; Write-Host " $msg" }
function Write-Err($msg)  { Write-Host "[خطا]" -ForegroundColor Red   -NoNewline; Write-Host " $msg" }

Write-Host "============================================================"
Write-Host "  ماه‌ای (MahAI) — عامل هوشمند سازمانی | شرکت ماه‌افزار هوشمند رسا"
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

# ---------- ۳) بررسی موجودی بسته dsh ----------
$ChinaMirror = "https://registry.npmmirror.com/"
Write-Log "بررسی موجودی @deepseek-ai/dsh در رجیستری فعلی…"
npm view "@deepseek-ai/dsh" version 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Err "بسته dsh در این رجیستری یافت نشد (میرور ایران بسته‌های scoped را کامل پوشش نمی‌دهد)."
    Write-Log "سوییچ خودکار به میرور چینی npmmirror.com (از ایران قابل دسترس است)…"
    npm config set registry $ChinaMirror
    npm view "@deepseek-ai/dsh" version 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        npm config set registry $IranMirror
        Write-Err "در npmmirror هم پیدا نشد. با پروکسی + رجیستری رسمی امتحان کنید یا از سورس محلی dsh/ نصب کنید (آموزش ۰۲)."
    } else {
        Write-Log "بسته پیدا شد ✓ (رجیستری روی npmmirror.com تنظیم شد؛ برگشت: npm config set registry $IranMirror)"
    }
} else {
    Write-Log "بسته dsh در رجیستری فعلی موجود است ✓"
}

# ---------- ۴) پروکسی (اختیاری) ----------
if ($env:PROXY) {
    Write-Log "تنظیم پروکسی روی $($env:PROXY)"
    $env:HTTP_PROXY  = $env:PROXY
    $env:HTTPS_PROXY = $env:PROXY
    $env:NO_PROXY    = "localhost,127.0.0.1,registry.npmjs.ir"
}

# ---------- ۵) بومی‌سازی رابط وب (فارسی‌سازی + تم آبی ماه‌ای) ----------
# لایهٔ ماه‌ای روی dist فرانت‌اند نصب‌شدهٔ dsh اعمال می‌شود.
# ابتدا کش npx را «گرم» می‌کنیم تا بسته دانلود شده باشد، سپس پچ:
$Patch = Join-Path $PSScriptRoot 'patch-mahai-ui.ps1'

Write-Log "آماده‌سازی موتور (دانلود dsh در صورت نیاز — ممکن است طول بکشد)…"
& npx -y "@deepseek-ai/dsh" --version 2>$null | Out-Null

if (Test-Path $Patch) {
    Write-Log "اعمال پوستهٔ فارسی ماه‌ای روی رابط وب…"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $Patch
    if ($LASTEXITCODE -ne 0) {
        Write-Log "پوستهٔ ماه‌ای اعمال نشد؛ بعد از این اجرا یک‌بار بزنید: powershell -ExecutionPolicy Bypass -File scripts\patch-mahai-ui.ps1"
    }
}

# ---------- ۶) اجرای dsh ----------
Write-Log "همه تنظیمات انجام شد. اجرای موتور ماه‌ای (dsh web)…"
Write-Host ""
Write-Host "  دستور: npx @deepseek-ai/dsh web"
Write-Host "  آدرس پس از اجرا: http://127.0.0.1:3080"
Write-Host ""
Write-Log "نکته: اولین اجرا ممکن است چند دقیقه طول بکشد (دانلود بسته). تا لاگ گوش‌دادن سرور ظاهر نشده، مرورگر ERR_CONNECTION_REFUSED می‌دهد — نگران نباشید، صبر کنید و بعد Reload بزنید."
Write-Host ""
Write-Log "مهم: این پنجره را باز نگه دارید — این پنجره خودِ موتور است! با Ctrl+C یا بستن پنجره، سایت خاموش می‌شود."
Write-Log "آدرس کامل همراه توکن در خط «dsh web: http://127.0.0.1:3080/?token=...» چاپ می‌شود — همان را در مرورگر باز کنید و با Ctrl+F5 تازه‌سازی کنید."
Write-Host ""
Write-Log "اگر روزی رابط انگلیسی شد (به‌روزرسانی dsh)، یک‌بار بزنید: powershell -ExecutionPolicy Bypass -File scripts\patch-mahai-ui.ps1"
Write-Host ""
Write-Log "یادآوری مهم: آدرس برنامه فقط «127.0.0.1:3080» نیست — باید کامل و همراه «?token=...» باشد؛ در غیر این صورت مرورگر صفحهٔ انگلیسی «dsh web authentication required» نشان می‌دهد."
Write-Host ""

# اجرای موتور + شکار خودکار خط «dsh web: …?token=…»
# آدرس کامل در کلیپ‌بورد کپی می‌شود تا کاربر فقط در مرورگر Ctrl+V بزند.
$script:MahaiUrl = $null
npx -y "@deepseek-ai/dsh" web 2>&1 | ForEach-Object {
    $line = "$_"
    Write-Host $line
    if (-not $script:MahaiUrl -and $line -match 'dsh web:\s*(https?://\S+)') {
        $script:MahaiUrl = $Matches[1].Trim()
        try { Set-Clipboard -Value $script:MahaiUrl } catch { }
        Write-Host ""
        Write-Host "  ==============================================================" -ForegroundColor Cyan
        Write-Host "   آدرس کامل برنامهٔ ماه‌ای (همین را در مرورگر باز کنید):" -ForegroundColor Yellow
        Write-Host "   $($script:MahaiUrl)" -ForegroundColor Yellow
        if ($script:MahaiUrl -like '*token=*') {
            Write-Host "   ✓ آدرس به کلیپ‌بورد کپی شد — در نوار آدرس مرورگر فقط Ctrl+V بزنید." -ForegroundColor Cyan
        } else {
            Write-Host "   ⚠ توکن در خط بالا دیده نشد؛ کل خط dsh web را دستی کپی کنید." -ForegroundColor Red
        }
        Write-Host "   ⚠ باز کردن تنها 127.0.0.1:3080 (بدون توکن) صفحهٔ «authentication required» می‌دهد — این خرابی پوسته نیست!" -ForegroundColor Red
        Write-Host "   بعد از باز شدن: Ctrl+F5 بزنید و برند «پوستهٔ فارسی ۱۰» را در سایدبار ببینید." -ForegroundColor Cyan
        Write-Host "   دقت: با هر اجرای مجدد سرور، توکن عوض می‌شود — همیشه آخرین خط را کپی کنید." -ForegroundColor Yellow
        Write-Host "  ==============================================================" -ForegroundColor Cyan
        Write-Host ""
    }
}
