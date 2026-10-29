#!/usr/bin/env bash
# ============================================================
# setup-iran.sh — اسکریپت راه‌اندازی ماه‌ای (محصول شرکت ماه‌افزار هوشمند رسا)
# ------------------------------------------------------------
# کارها:
#   ۱) بررسی Node.js (نسخه ۲۰+)
#   ۲) تنظیم میرور ایرانی npm برای npm و pnpm
#   ۳) (اختیاری) تنظیم متغیرهای پروکسی
#   ۴) دانلود dsh و اعمال پوستهٔ فارسی ماه‌ای روی رابط وب
#   ۵) اجرای dsh web
# استفاده:
#   bash setup-iran.sh                 # میرور + اجرا
#   PROXY=http://127.0.0.1:8118 bash setup-iran.sh   # با پروکسی
#   bash setup-iran.sh --restore       # برگشت به رجیستری رسمی
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IRAN_MIRROR="https://registry.npmjs.ir/"
OFFICIAL="https://registry.npmjs.org/"

log() { printf "\033[1;32m[ماه‌ای]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[خطا]\033[0m %s\n" "$*" >&2; }

# ---------- حالت برگشت ----------
if [[ "${1:-}" == "--restore" ]]; then
  log "برگشت رجیستری npm به حالت رسمی…"
  npm config set registry "$OFFICIAL" || true
  command -v pnpm >/dev/null 2>&1 && pnpm config set registry "$OFFICIAL" --global || true
  log "انجام شد."
  exit 0
fi

echo "============================================================"
echo "  ماه‌ای (MahAI) — عامل هوشمند سازمانی | شرکت ماه‌افزار هوشمند رسا"
echo "  https://github.com/sjalilvand/Agent_mahai"
echo "============================================================"

# ---------- ۱) بررسی Node.js ----------
if ! command -v node >/dev/null 2>&1; then
  err "Node.js نصب نیست. لطفاً ابتدا Node.js نسخه ۲۰ یا بالاتر نصب کنید."
  err "راهنما: docs-fa/02-نصب-گام-به-گام.md (گام ۱)"
  exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  err "نسخه Node.js شما ($(node --version)) قدیمی است؛ نسخه ۲۰ یا بالاتر لازم است."
  exit 1
fi
log "Node.js نسخه $(node --version) ✓"

# ---------- ۲) تنظیم میرور ----------
log "تنظیم میرور ایرانی npm: $IRAN_MIRROR"
npm config set registry "$IRAN_MIRROR"
if command -v pnpm >/dev/null 2>&1; then
  pnpm config set registry "$IRAN_MIRROR" --global || true
  log "میرور برای pnpm هم تنظیم شد ✓"
fi
if npm ping >/dev/null 2>&1; then
  log "اتصال به میرور سالم است ✓ (npm ping → pong)"
else
  err "میرور پاسخ نداد. اگر پروکسی دارید، اسکریپت را با PROXY=... اجرا کنید."
  err "مثال: PROXY=http://127.0.0.1:8118 bash setup-iran.sh"
fi

# ---------- ۲.۵) بررسی موجودی بسته dsh ----------
NPM_CHINA_MIRROR="https://registry.npmmirror.com/"
log "بررسی موجودی @deepseek-ai/dsh در رجیستری فعلی…"
if ! npm view @deepseek-ai/dsh version >/dev/null 2>&1; then
  err "بسته dsh در این رجیستری یافت نشد (میرور ایران بسته‌های scoped را کامل پوشش نمی‌دهد)."
  log "سوییچ خودکار به میرور چینی npmmirror.com (از ایران قابل دسترس است)…"
  npm config set registry "$NPM_CHINA_MIRROR"
  if npm view @deepseek-ai/dsh version >/dev/null 2>&1; then
    log "بسته پیدا شد ✓ (رجیستری روی npmmirror.com تنظیم شد؛ برگشت: npm config set registry $IRAN_MIRROR)"
  else
    npm config set registry "$IRAN_MIRROR"
    err "در npmmirror هم پیدا نشد. با پروکسی + رجیستری رسمی امتحان کنید یا از سورس محلی dsh/ نصب کنید (آموزش ۰۲)."
  fi
else
  log "بسته dsh در رجیستری فعلی موجود است ✓"
fi

# ---------- ۳) پروکسی (اختیاری) ----------
if [[ -n "${PROXY:-}" ]]; then
  log "تنظیم متغیرهای پروکسی روی $PROXY"
  export HTTP_PROXY="$PROXY"
  export HTTPS_PROXY="$PROXY"
  export http_proxy="$PROXY"
  export https_proxy="$PROXY"
  export NO_PROXY="localhost,127.0.0.1,registry.npmjs.ir"
  export no_proxy="localhost,127.0.0.1,registry.npmjs.ir"
fi

# ---------- ۴) بومی‌سازی رابط وب (فارسی‌سازی + تم آبی ماه‌ای) ----------
# لایهٔ ماه‌ای روی dist فرانت‌اند نصب‌شدهٔ dsh اعمال می‌شود.
# ابتدا کش npx را «گرم» می‌کنیم تا بسته دانلود شده باشد، سپس پچ:
log "آماده‌سازی موتور (دانلود dsh در صورت نیاز — ممکن است طول بکشد)…"
npx -y @deepseek-ai/dsh --version >/dev/null 2>&1 || true
if [[ -f "$ROOT/scripts/patch-mahai-ui.sh" ]]; then
  log "اعمال پوستهٔ فارسی ماه‌ای روی رابط وب…"
  bash "$ROOT/scripts/patch-mahai-ui.sh" || log "پوستهٔ ماه‌ای اعمال نشد؛ بعد از این اجرا دستور زیر را بزنید:"
fi

# ---------- ۵) اجرای dsh ----------
log "همه تنظیمات انجام شد. اجرای موتور ماه‌ای (dsh web)…"
echo ""
echo "  دستور: npx @deepseek-ai/dsh web"
echo "  آدرس پس از اجرا: http://127.0.0.1:3080"
echo ""
log "نکته: اولین اجرا ممکن است چند دقیقه طول بکشد (دانلود بسته). تا لاگ گوش‌دادن سرور ظاهر نشده، مرورگر ERR_CONNECTION_REFUSED می‌دهد — نگران نباشید، صبر کنید و بعد Reload بزنید."
echo ""
log "مهم: این پنجره را باز نگه دارید — این پنجره خودِ موتور است! با Ctrl+C یا بستن پنجره، سایت خاموش می‌شود."
log "آدرس کامل همراه توکن در خط «dsh web: http://127.0.0.1:3080/?token=...» چاپ می‌شود — همان را در مرورگر باز کنید و با Ctrl+F5 تازه‌سازی کنید."
echo ""
log "اگر روزی رابط انگلیسی شد (به‌روزرسانی dsh)، یک‌بار بزنید: bash scripts/patch-mahai-ui.sh"
echo ""
log "یادآوری مهم: آدرس برنامه فقط «127.0.0.1:3080» نیست — باید کامل و همراه «?token=...» باشد؛ در غیر این صورت مرورگر صفحهٔ انگلیسی «dsh web authentication required» نشان می‌دهد."
echo ""

# اجرای موتور + شکار خودکار خط «dsh web: …?token=…» (کلیپ‌بورد در صورت وجود ابزار)
MAHAI_URL=""
re='dsh web:[[:space:]]*(https?://[^[:space:]]+)'
npx -y @deepseek-ai/dsh web 2>&1 | while IFS= read -r line; do
  printf '%s\n' "$line"
  if [[ -z "${MAHAI_URL:-}" && "$line" =~ $re ]]; then
    MAHAI_URL="${BASH_REMATCH[1]}"
    echo ""
    printf '\033[1;36m  ==============================================================\033[0m\n'
    printf '\033[1;33m   آدرس کامل برنامهٔ ماه‌ای (همین را در مرورگر باز کنید):\033[0m\n'
    printf '\033[1;33m   %s\033[0m\n' "$MAHAI_URL"
    if   command -v xclip  >/dev/null 2>&1; then printf '%s' "$MAHAI_URL" | xclip  -selection clipboard 2>/dev/null || true
    elif command -v xsel   >/dev/null 2>&1; then printf '%s' "$MAHAI_URL" | xsel   --clipboard            2>/dev/null || true
    elif command -v wl-copy >/dev/null 2>&1; then printf '%s' "$MAHAI_URL" | wl-copy                      2>/dev/null || true
    elif command -v pbcopy >/dev/null 2>&1; then printf '%s' "$MAHAI_URL" | pbcopy                        2>/dev/null || true
    fi
    if [[ "$MAHAI_URL" == *token=* ]]; then
      printf '\033[1;36m   ✓ آدرس در کلیپ‌بورد کپی شد — در نوار آدرس مرورگر فقط Ctrl+V بزنید.\033[0m\n'
    else
      printf '\033[1;31m   ⚠ توکن در خط بالا دیده نشد؛ کل خط dsh web را دستی کپی کنید.\033[0m\n'
    fi
    printf '\033[1;31m   ⚠ باز کردن تنها 127.0.0.1:3080 (بدون توکن) صفحهٔ «authentication required» می‌دهد — این خرابی پوسته نیست!\033[0m\n'
    printf '\033[1;36m   بعد از باز شدن: Ctrl+F5 بزنید و برند «پوستهٔ فارسی ۷» را در سایدبار ببینید.\033[0m\n'
    printf '\033[1;33m   دقت: با هر اجرای مجدد سرور، توکن عوض می‌شود — همیشه آخرین خط را کپی کنید.\033[0m\n'
    printf '\033[1;36m  ==============================================================\033[0m\n'
    echo ""
  fi
done
