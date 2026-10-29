# ============================================================
# proxy-env.sh — قالب متغیرهای محیطی پروکسی
# ------------------------------------------------------------
# استفاده:
#   ۱) آدرس و پورت را با سرویس پروکسی خودتان عوض کنید
#   ۲) source proxy-env.sh
# (این تنظیم فقط در همین ترمینال اعمال می‌شود)
# ============================================================

export HTTP_PROXY="http://127.0.0.1:8118"
export HTTPS_PROXY="http://127.0.0.1:8118"
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"

# آدرس‌های داخلی/محلی از پروکسی عبور نکنند
export NO_PROXY="localhost,127.0.0.1,::1,registry.npmjs.ir,.ir"
export no_proxy="$NO_PROXY"

echo "✓ متغیرهای پروکسی تنظیم شد:"
echo "  HTTPS_PROXY=$HTTPS_PROXY"
echo "  NO_PROXY=$NO_PROXY"
