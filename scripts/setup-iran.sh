#!/usr/bin/env bash
# ============================================================
# setup-iran.sh — اسکریپت بومی‌سازی ایران برای DeepSeek Harness
# ------------------------------------------------------------
# کارها:
#   ۱) بررسی Node.js (نسخه ۲۰+)
#   ۲) تنظیم میرور ایرانی npm برای npm و pnpm
#   ۳) (اختیاری) تنظیم متغیرهای پروکسی
#   ۴) اجرای dsh web
# استفاده:
#   bash setup-iran.sh                 # میرور + اجرا
#   PROXY=http://127.0.0.1:8118 bash setup-iran.sh   # با پروکسی
#   bash setup-iran.sh --restore       # برگشت به رجیستری رسمی
# ============================================================
set -euo pipefail

IRAN_MIRROR="https://registry.npmjs.ir/"
OFFICIAL="https://registry.npmjs.org/"

log() { printf "\033[1;32m[Agent_mahai]\033[0m %s\n" "$*"; }
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
echo "  بومی‌سازی ایران برای DeepSeek Harness (dsh)"
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

# ---------- ۴) اجرای dsh ----------
log "همه تنظیمات انجام شد. اجرای dsh web…"
echo ""
echo "  دستور: npx @deepseek-ai/dsh web"
echo "  آدرس پس از اجرا: http://127.0.0.1:3080"
echo ""
exec npx -y @deepseek-ai/dsh web
