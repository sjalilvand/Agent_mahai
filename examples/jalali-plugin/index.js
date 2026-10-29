// ============================================================
// پلاگین نمونه «تقویم شمسی» برای DeepSeek Harness (dsh)
// ------------------------------------------------------------
// یک ابزار مدل‌محور (date_convert) به عامل اضافه می‌کند که
// تاریخ را بین تقویم جلالی و میلادی تبدیل می‌کند.
// اجرا:  pnpm dsh web --patch ./cordis.patch.yml
// تست:   در مکالمه بپرسید «۲۵ اسفند ۱۴۰۴ کدام تاریخ میلادی است؟»
// ============================================================

export const name = 'jalali-tool'

// ---------- توابع کمکی الگوریتم جلالی (استاندارد) ----------
function div(a, b) { return ~~(a / b) }

function jalCal(jy) {
  // روزهای استثنای تقویم جلالی بر اساس جدول استاندارد
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178]
  let bl = breaks.length, gy = jy + 621, leapJ = -14, jp = breaks[0], jm, jump = 0, leap, n, i
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm) break
    leapJ = leapJ + div(jump, 33) * 8 + div(jump % 33, 4)
    jp = jm
  }
  n = jy - jp
  leapJ = leapJ + div(n, 33) * 8 + div(n % 33 + 3, 4)
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150
  const march = 20 + leapJ - leapG
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33
  leap = ((((n + 1) % 33) - 1) % 4)
  if (leap === -1) leap = 4
  return { leap, gy, march }
}

// روز ژولینی از تاریخ میلادی
function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * ((gm + 9) % 12) + 2, 5) + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

// تاریخ میلادی از روز ژولینی
function d2g(jdn) {
  let j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const i = div((j % 1461) / 4, 1) * 5 + 308
  const gd = div((i % 153) / 5, 1) + 1
  const gm = (~~(i / 153)) % 12 + 1
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return { gy, gm, gd }
}

function jalaaliToGregorian(jy, jm, jd) {
  const r = jalCal(jy)
  return d2g(g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1)
}

function gregorianToJalali(gy, gm, gd) {
  const d2 = g2d(gy, gm, gd)
  let jy = gy - 621
  const r = jalCal(jy)
  const jdn1f = g2d(gy, 3, r.march)
  let k = d2 - jdn1f
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: (k % 31) + 1 }
    k -= 186
  } else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }
  return { jy, jm: 7 + div(k, 30), jd: (k % 30) + 1 }
}

// ---------- تعریف پلاگین Cordis ----------
export const inject = ['tools'] // به رجیستری ابزار نیاز داریم

const MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
const pad = (n) => String(n).padStart(2, '0')

export function apply(ctx) {
  ctx.tools.register({
    name: 'date_convert',
    description: 'تبدیل تاریخ بین تقویم شمسی (جلالی) و میلادی. برای هر پرسش تاریخ مرتبط با ایران از این ابزار استفاده کن.',
    parameters: {
      direction: {
        type: 'string',
        required: true,
        enum: ['jalali-to-gregorian', 'gregorian-to-jalali'],
        description: 'جهت تبدیل',
      },
      year:  { type: 'number', required: true, description: 'سال (مثلاً 1404 یا 2026)' },
      month: { type: 'number', required: true, description: 'ماه، عدد ۱ تا ۱۲' },
      day:   { type: 'number', required: true, description: 'روز ماه' },
    },
    // خروجی متعارف: آبجکت ساختاریافته
    async execute(args) {
      if (args.direction === 'jalali-to-gregorian') {
        const g = jalaaliToGregorian(args.year, args.month, args.day)
        return {
          gregorian: `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`,
          persian: `${args.year} ${MONTHS[args.month - 1]} ${args.day}`,
        }
      }
      const j = gregorianToJalali(args.year, args.month, args.day)
      return {
        jalali: `${j.jy}-${pad(j.jm)}-${pad(j.jd)}`,
        persian: `${j.jy} ${MONTHS[j.jm - 1]} ${j.jd}`,
      }
    },
    // رندر رو‌به‌روی مدل: متنی و بدون ابهام
    output: { schema: { type: 'object' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v) }] },
  })
}
