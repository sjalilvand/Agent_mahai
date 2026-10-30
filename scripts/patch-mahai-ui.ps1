# ============================================================
# ماه‌ای (MahAI) — اعمال بومی‌سازی فارسی روی رابط وب dsh
# محصول شرکت ماه‌افزار هوشمند رسا
# استفاده:  powershell -ExecutionPolicy Bypass -File scripts\patch-mahai-ui.ps1
# همه‌جای نصب‌شدهٔ dsh-web-frontend را می‌یابد (نصب محلی یا کش npx)
# و لایهٔ ماه‌ای را اعمال می‌کند. اجرای مکرر بی‌ضرر است.
# ============================================================
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Apply = Join-Path $Root 'scripts\mahai-ui\apply.js'

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ماه‌ای] خطا: Node.js یافت نشد. ابتدا Node را نصب کنید." -ForegroundColor Red
    exit 1
}

# --- یافتن همهٔ dist های موجود ---
$targets = New-Object System.Collections.Generic.List[string]

function Add-Target([string]$p) {
    if ($p -and (Test-Path $p) -and -not $targets.Contains($p)) { $targets.Add($p) }
}

# ۱) نصب محلی کنار مخزن و پوشهٔ جاری
Add-Target (Join-Path $Root 'node_modules\@deepseek-ai\dsh-web-frontend\dist')
Add-Target (Join-Path (Get-Location).Path 'node_modules\@deepseek-ai\dsh-web-frontend\dist')

# ۲) کش npx (محل نصب پیش‌فرضِ «npx @deepseek-ai/dsh web»)
$cache = & npm config get cache 2>$null
if ($cache -and (Test-Path (Join-Path $cache '_npx'))) {
    Get-ChildItem -Path (Join-Path $cache '_npx') -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        Add-Target (Join-Path $_.FullName 'node_modules\@deepseek-ai\dsh-web-frontend\dist')
    }
}

if ($targets.Count -eq 0) {
    Write-Host "[ماه‌ای] هیچ نصبی از dsh-web-frontend پیدا نشد." -ForegroundColor Yellow
    Write-Host "[ماه‌ای] ابتدا یک‌بار «npx @deepseek-ai/dsh web» را اجرا کنید تا دانلود شود، سپس این اسکریپت را دوباره اجرا کنید."
    exit 3
}

foreach ($t in $targets) {
    & node $Apply $t
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "[ماه‌ای] ✓ بومی‌سازی روی $($targets.Count) نصب اعمال شد." -ForegroundColor Green
Write-Host "[ماه‌ای] برای تازه‌سازی: در پنجرهٔ برنامه Ctrl+F5 بزنید."
Write-Host "[ماه‌ای] آزمون مطمئن: پنجرهٔ ناشناس (InPrivate) باز کنید و «کل» خط dsh web: http://127.0.0.1:3080/?token=... را از ترمینال کپی و در نوار آدرس بچسبانید — نه فقط 127.0.0.1:3080."
Write-Host "[ماه‌ای] اگر صفحهٔ انگلیسی «dsh web authentication required» دیدید، یعنی آدرس را بدون توکن باز کرده‌اید — این خرابی پوسته نیست؛ کل خط (با ?token=) را دوباره کپی کنید."
Write-Host "[ماه‌ای] دقت: با هر اجرای مجدد سرور توکن عوض می‌شود؛ توکن‌های قدیمی و بوکمارک‌های قبلی بی‌اعتبارند."
Write-Host "[ماه‌ای] اگر در برند سایدبار «پوستهٔ فارسی ۱۰» دیدید، نسخهٔ جدید فعال است."
