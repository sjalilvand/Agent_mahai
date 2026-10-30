#!/usr/bin/env bash
# ============================================================
# ماه‌ای (MahAI) — اعمال بومی‌سازی فارسی روی رابط وب dsh
# محصول شرکت ماه‌افزار هوشمند رسا
# استفاده:  bash scripts/patch-mahai-ui.sh
# همه‌جای نصب‌شدهٔ dsh-web-frontend را می‌یابد (نصب محلی یا کش npx)
# و لایهٔ ماه‌ای را اعمال می‌کند. اجرای مکرر بی‌ضرر است.
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPLY="$ROOT/scripts/mahai-ui/apply.js"

if ! command -v node >/dev/null 2>&1; then
  echo "[ماه‌ای] خطا: Node.js یافت نشد. ابتدا Node را نصب کنید."
  exit 1
fi

# --- یافتن همهٔ dist های موجود ---
declare -a CAND=()

# ۱) نصب محلی کنار مخزن و پوشهٔ جاری
for base in "$ROOT" "$PWD"; do
  d="$base/node_modules/@deepseek-ai/dsh-web-frontend/dist"
  [ -d "$d" ] && CAND+=("$d")
done

# ۲) کش npx (محل نصب پیش‌فرضِ «npx @deepseek-ai/dsh web»)
CACHE="$(npm config get cache 2>/dev/null || true)"
if [ -n "$CACHE" ] && [ -d "$CACHE/_npx" ]; then
  for d in "$CACHE"/_npx/*/node_modules/@deepseek-ai/dsh-web-frontend/dist; do
    [ -d "$d" ] && CAND+=("$d")
  done
fi

# حذف تکراری‌ها
UNIQ="$(printf '%s\n' "${CAND[@]:-}" | sort -u)"

COUNT=0
while IFS= read -r d; do
  [ -z "$d" ] && continue
  node "$APPLY" "$d"
  COUNT=$((COUNT + 1))
done <<< "$UNIQ"

if [ "$COUNT" -eq 0 ]; then
  echo "[ماه‌ای] هیچ نصبی از dsh-web-frontend پیدا نشد."
  echo "[ماه‌ای] ابتدا یک‌بار «npx @deepseek-ai/dsh web» را اجرا کنید تا دانلود شود، سپس این اسکریپت را دوباره اجرا کنید."
  exit 3
fi

echo "[ماه‌ای] ✓ بومی‌سازی روی $COUNT نصب اعمال شد."
echo "[ماه‌ای] برای تازه‌سازی: در پنجرهٔ برنامه Ctrl+F5 بزنید."
echo "[ماه‌ای] آزمون مطمئن: پنجرهٔ ناشناس باز کنید و «کل» خط dsh web: http://127.0.0.1:3080/?token=... را از ترمینال کپی و در نوار آدرس بچسبانید — نه فقط 127.0.0.1:3080."
echo "[ماه‌ای] اگر صفحهٔ انگلیسی «dsh web authentication required» دیدید، یعنی آدرس را بدون توکن باز کرده‌اید — این خرابی پوسته نیست؛ کل خط (با ?token=) را دوباره کپی کنید."
echo "[ماه‌ای] دقت: با هر اجرای مجدد سرور توکن عوض می‌شود؛ توکن‌های قدیمی و بوکمارک‌های قبلی بی‌اعتبارند."
echo "[ماه‌ای] اگر در برند سایدبار «پوستهٔ فارسی ۹» دیدید، نسخهٔ جدید فعال است."
