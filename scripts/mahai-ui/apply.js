#!/usr/bin/env node
/**
 * ماه‌ای (MahAI) — اعمال لایهٔ بومی‌سازی روی dist فرانت‌اند dsh
 * محصول شرکت ماه‌افزار هوشمند رسا
 *
 * استفاده:  node apply.js <مسیر dist فرانت‌اند>
 * کارها:
 *   ۱) کپی دارایی‌های ماه‌ای (لوگو، فاوآیکن، css، js، فونت) به <dist>/mahai
 *   ۲) پچ <dist>/index.html : زبان/جهت، عنوان، فاوآیکن، تزریق css/js
 *   عملیات «توان‌بخش» (idempotent) است — اجرای مکرر بی‌ضرر است.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const OVERLAY = __dirname; // پوشهٔ mahai-ui
const MARKER = '<!-- ماه‌ای (MahAI) overlay -->';
const TITLE = 'ماه‌ای — عامل هوشمند سازمانی | ماه‌افزار هوشمند رسا';

function copyOverlay(dist) {
  const dst = path.join(dist, 'mahai');
  fs.mkdirSync(dst, { recursive: true });
  const files = ['logo.png', 'favicon.png', 'mahai.css', 'mahai.js'];
  for (const f of files) fs.copyFileSync(path.join(OVERLAY, f), path.join(dst, f));
  // فونت‌ها
  const fontsSrc = path.join(OVERLAY, 'fonts');
  if (fs.existsSync(fontsSrc)) {
    const fontsDst = path.join(dst, 'fonts');
    fs.mkdirSync(fontsDst, { recursive: true });
    for (const f of fs.readdirSync(fontsSrc)) {
      if (f.endsWith('.woff2')) fs.copyFileSync(path.join(fontsSrc, f), path.join(fontsDst, f));
    }
  }
  return dst;
}

function patchIndex(dist) {
  const p = path.join(dist, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  /* مهر نسخه برای شکستن کش مرورگر — هر بار پچ، css/js تازه بارگذاری می‌شود */
  const stamp = Date.now().toString(36);
  if (html.includes(MARKER)) {
    // قبلاً پچ شده — lang/title را اصلاح کن و نسخهٔ css/js را تازه کن
    let changed = false;
    if (!/html[^>]*\blang="fa"/.test(html)) { html = html.replace(/(<html[^>]*\blang=")[^"]*(")/i, '$1fa$2'); changed = true; }
    if (!/<html[^>]*\bdir="rtl"/.test(html)) { html = html.replace(/<html([^>]*)>/i, '<html$1 dir="rtl">'); changed = true; }
    if (!html.includes(TITLE)) { html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${TITLE}</title>`); changed = true; }
    const reStamp = (s) => {
      const next = s
        .replace(/(mahai\.css)(\?v=[a-z0-9]+)?/g, `$1?v=${stamp}`)
        .replace(/(mahai\.js)(\?v=[a-z0-9]+)?/g, `$1?v=${stamp}`);
      return next !== s ? (changed = true, next) : next;
    };
    html = reStamp(html);
    if (changed) fs.writeFileSync(p, html);
    return { patched: changed, fresh: false };
  }

  // ۱) زبان و جهت
  if (/<html[^>]*\blang="/i.test(html)) {
    html = html.replace(/(<html[^>]*\blang=")[^"]*(")/i, '$1fa$2');
  } else {
    html = html.replace(/<html([^>]*)>/i, '<html$1 lang="fa">');
  }
  if (!/<html[^>]*\bdir="/i.test(html)) {
    html = html.replace(/<html([^>]*)>/i, '<html$1 dir="rtl">');
  } else {
    html = html.replace(/(<html[^>]*\bdir=")[^"]*(")/i, '$1rtl$2');
  }

  // ۲) عنوان
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${TITLE}</title>`);

  // ۳) فاوآیکن ماه‌ای
  html = html.replace(/<link\s+rel="icon"[^>]*>/gi,
    '<link rel="icon" type="image/png" href="./mahai/favicon.png" />');

  // ۴) تزریق css/js پیش از </head> (با مهر نسخه)
  const inject = `${MARKER}\n    <link rel="stylesheet" href="./mahai/mahai.css?v=${stamp}" />\n` +
    `    <script src="./mahai/mahai.js?v=${stamp}"></script>\n  `;
  html = html.replace(/<\/head>/i, `  ${inject}</head>`);

  fs.writeFileSync(p, html);
  return { patched: true, fresh: true };
}

function main() {
  const dist = path.resolve(process.argv[2] || '');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error(`[ماه‌ای] dist نامعتبر است: ${dist}`);
    process.exit(2);
  }
  copyOverlay(dist);
  const r = patchIndex(dist);
  console.log(`[ماه‌ای] بومی‌سازی رابط اعمال شد: ${dist}${r.fresh ? ' (پچ تازه)' : ' (از قبل پچ‌شده)'}`);
}

main();
