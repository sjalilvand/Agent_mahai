/* ============================================================
   ماه‌ای (MahAI) — مترجم زندهٔ رابط وب dsh به فارسی
   محصول شرکت ماه‌افزار هوشمند رسا
   ============================================================
   نکتهٔ مهم v10 — راست‌چین‌سازی داده‌محور:
   نسخه‌های ≤۸ dir="rtl" را روی <html> می‌گذاشتند و چیدمان اپ
   (که با ویژگی‌های فیزیکی left/right ساخته شده) آینه و نیمه می‌شد.
   v9 چیدمان را کاملاً دست‌نخورده گذاشت، اما متن فارسی داخل ردیف‌های
   چپ‌چین، «چپ‌چین» دیده می‌شد. v10 میانهٔ طلایی است: فقط «ردیف‌ها و
   بلوک‌های سادهٔ متنی‌ای که متنشان فارسی شد» راست‌چین می‌شوند
   (rtlFit) — آیکن‌ها راست می‌افتند و متن از راست شروع می‌شود؛
   ردیف‌های انگلیسی/کد و اسکلت صفحه (ستون‌های اصلی، سایدبار،
   پوشه‌ها) هرگز flip نمی‌شوند. خطای احتمالی حداکثر «یک ردیف» است،
   نه نیمهٔ صفحه.
  نکتهٔ v9 — چیدمان:
   چیدمان flex/grid اپ دست‌نخورده می‌ماند؛ جهت متنِ درون عناصر
   متنی با unicode-bidi: plaintext از mahai.css تنظیم می‌شود.
   روش کار: یک دیکشنری «متن کامل انگلیسی/چینی ← فارسی» روی گره‌های
   متنی DOM اعمال می‌شود (MutationObserver). فقط تطبیق «کامل» ترجمه
   می‌شود؛ بنابراین متن پیام‌های خود کاربر هرگز دست‌نخورده می‌ماند.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ۱) زبان صفحه — بدون دست‌کاری جهت چیدمان ---------- */
  var html = document.documentElement;
  html.setAttribute('lang', 'fa');
  /* ترمیم پوسته‌های قدیمی: اگر نسخهٔ قبل dir="rtl" گذاشته بود، بردار */
  if (html.getAttribute('dir') === 'rtl') html.removeAttribute('dir');

  var TITLE = 'ماه‌ای — عامل هوشمند سازمانی | ماه‌افزار هوشمند رسا';

  /* نسخهٔ پوستهٔ فارسی — با هر انتشار +۱ می‌شود. در نوار برند سایدبار نمایش
     داده می‌شود تا کاربر ببیند کدام نسخه در مرورگرش اجراست (تشخیص کش). */
  var SKIN_VER = '10';
  try {
    window.__MAHAI_SKIN = SKIN_VER;
    console.log('%c ماه‌ای — پوستهٔ فارسی نسخهٔ ' + SKIN_VER + ' ',
      'background:#1d4ed8;color:#fff;border-radius:4px;font-weight:bold');
  } catch (e) { /* خاموش */ }

  /* ---------- ۲) دیکشنری رابط ---------- */
  var D = {
    /* نوار کناری و ناوبری */
    'New Session': 'گفت‌وگوی جدید',
    'New session': 'گفت‌وگوی جدید',
    'Open sidebar': 'باز کردن نوار کناری',
    'Collapse sidebar': 'جمع کردن نوار کناری',
    'Toggle left sidebar': 'نمایش/جمع کردن نوار کناری',
    'Global panels': 'پنل‌های سراسری',
    'Workspaces': 'فضاهای کاری',
    'Default workspace': 'فضای کاری پیش‌فرض',
    'Add workspace': 'افزودن فضای کاری',
    'Add workspace…': 'افزودن فضای کاری…',
    'Sessions': 'گفت‌وگوها',
    'Chat': 'گفت‌وگو',
    'Dialogue': 'گفت‌وگو',
    'Plugins': 'افزونه‌ها',
    'Automation tasks': 'کارهای خودکار',
    'Automation task': 'کار خودکار',
    'More': 'بیشتر',
    'Untitled': 'بدون عنوان',
    'Running': 'در حال اجرا',
    'Not running': 'در حال اجرا نیست',
    'Idle': 'آماده',
    'In progress': 'در حال انجام',
    'Filter sessions': 'پالایش گفت‌وگوها',
    'Search sessions': 'جست‌وجوی گفت‌وگوها',
    'Search session names': 'جست‌وجوی نام گفت‌وگوها',
    'Clear search': 'پاک کردن جست‌وجو',
    'Search results': 'نتایج جست‌وجو',
    'No matching sessions': 'گفت‌وگوی منطبقی نیست',
    'No sessions yet': 'هنوز گفت‌وگویی وجود ندارد',
    'No archived sessions yet': 'هنوز گفت‌وگوی بایگانی‌شده‌ای نیست',
    'View other sessions': 'مشاهدهٔ گفت‌وگوهای دیگر',
    'Hide archived': 'پنهان کردن بایگانی‌شده‌ها',
    'All conversations (show archived)': 'همهٔ گفت‌وگوها (نمایش بایگانی)',
    'Archived only': 'فقط بایگانی‌شده‌ها',
    'Show less': 'نمایش کمتر',
    'Show more': 'نمایش بیشتر',
    'View options': 'گزینه‌های نمایش',
    'Group by': 'گروه‌بندی بر اساس',
    'Order by': 'مرتب‌سازی بر اساس',
    'In one list': 'در یک فهرست',
    'Manual': 'دستی',
    'Last updated': 'آخرین به‌روزرسانی',
    'Ungrouped': 'گروه‌بندی‌نشده',
    'Workspace Tree': 'درخت فضای کاری',
    'WorkSpace': 'فضای کاری',
    'Rename': 'تغییر نام',
    'Rename workspace': 'تغییر نام فضای کاری',
    'Rename session': 'تغییر نام گفت‌وگو',
    'Workspace name': 'نام فضای کاری',
    'Session name': 'نام گفت‌وگو',
    'Delete workspace': 'حذف فضای کاری',
    'Deleting workspace…': 'در حال حذف فضای کاری…',
    'Fork session': 'انشعاب از گفت‌وگو',
    'Archive session': 'بایگانی گفت‌وگو',
    'Unarchive session': 'خروج از بایگانی',
    'Pin session': 'سنجاق کردن گفت‌وگو',
    'Unpin session': 'برداشتن سنجاق',
    'Copy Session ID': 'کپی شناسهٔ گفت‌وگو',
    'Session ID copied': 'شناسهٔ گفت‌وگو کپی شد',
    'Copy failed. Try again.': 'کپی ناموفق بود. دوباره تلاش کنید.',
    'Copy failed': 'کپی ناموفق بود',
    'Archived': 'بایگانی‌شده',
    'Pinned': 'سنجاق‌شده',
    'Archive': 'بایگانی',
    'Unarchive': 'خروج از بایگانی',
    'Pin': 'سنجاق',
    'Unpin': 'برداشتن سنجاق',
    'Stop and archive': 'توقف و بایگانی',
    'Stop and archive this session?': 'این گفت‌وگو متوقف و بایگانی شود؟',
    'Work that will be stopped': 'کاری که متوقف خواهد شد',
    'The turn in progress': 'نوبت در حال اجرا',
    'Stopping and archiving…': 'در حال توقف و بایگانی…',
    'Session archived. You can ': 'گفت‌وگو بایگانی شد. می‌توانید ',
    'Session stopped and archived. You can ': 'گفت‌وگو متوقف و بایگانی شد. می‌توانید ',
    'Archived sessions cannot be opened. Unarchive it to view.': 'گفت‌وگوی بایگانی‌شده باز نمی‌شود؛ برای مشاهده از بایگانی خارجش کنید.',
    'Pin failed. Try again later.': 'سنجاق ناموفق بود. بعداً تلاش کنید.',
    'Unpin failed. Try again later.': 'برداشتن سنجاق ناموفق بود. بعداً تلاش کنید.',
    'Open original session': 'باز کردن گفت‌وگوی اصلی',
    'Open the original session to complete migration before creating a branch.': 'برای انشعاب، نخست گفت‌وگوی اصلی را باز کنید تا مهاجرت کامل شود.',
    'Session hierarchy': 'سلسله‌مراتب گفت‌وگو',
    'More conversation views': 'نمای‌های بیشتر گفت‌وگو',
    'Searching session history…': 'جست‌وجوی تاریخچهٔ گفت‌وگوها…',
    'No matches': 'موردی یافت نشد',
    'Loading workspaces…': 'در حال بارگذاری فضاهای کاری…',
    'Waiting for approval': 'در انتظار تأیید',
    'Plan awaiting review': 'برنامه در انتظار بازبینی',
    'Waiting for answer': 'در انتظار پاسخ',
    'Approval': 'تأیید',
    'Plan review': 'بازبینی برنامه',
    'Answer': 'پاسخ',
    'Select a session first': 'نخست یک گفت‌وگو انتخاب کنید',
    'Choose a workspace first.': 'نخست فضای کاری را انتخاب کنید.',
    'Couldn’t open folder': 'باز کردن پوشه ممکن نشد',
    'Choose again': 'انتخاب دوباره',
    'Directory picker unavailable': 'انتخابگر پوشه در دسترس نیست',
    'Unable to create default workspace. Use Choose workspace to select a folder.': 'ساخت فضای کاری پیش‌فرض ممکن نشد. از «انتخاب فضای کاری» برای انتخاب پوشه استفاده کنید.',
    'Selecting or adding a workspace': 'در حال انتخاب یا افزودن فضای کاری',
    'This session has no completed turn': 'این گفت‌وگو نوبت کامل‌شده‌ای ندارد',
    'Could not fork the session. Try again.': 'انشعاب از گفت‌وگو ممکن نشد. دوباره تلاش کنید.',
    'This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.': 'این گفت‌وگو همین حالا در استفاده است؛ شاید نمونهٔ دیگری از ماه‌ای (مثل dsh web یا برنامهٔ رومیزی) آن را باز کرده. نمونه‌های دیگر را ببندید و دوباره تلاش کنید.',

    /* دیالوگ شروع (Get started) */
    'Welcome to': 'خوش آمدید به',
    'Get started': 'شروع کنید',
    'Add API Key': 'افزودن کلید API',
    'Sign in': 'ورود',
    'Sign in again': 'ورود دوباره',
    'Waiting for sign in': 'در انتظار ورود',
    'Page did not open automatically?': 'صفحه به‌صورت خودکار باز نشد؟',
    'Copy sign-in link': 'کپی پیوند ورود',
    'Link copied': 'پیوند کپی شد',
    'Sign in timed out': 'زمان ورود به پایان رسید',
    'Sign in again to continue.': 'برای ادامه، دوباره وارد شوید.',
    'Could not sign in': 'ورود انجام نشد',
    'Could not complete the operation. Try again.': 'انجام عملیات ممکن نشد. دوباره تلاش کنید.',
    'Could not save settings. Try again.': 'ذخیرهٔ تنظیمات ممکن نشد. دوباره تلاش کنید.',
    'Add credits': 'افزودن اعتبار',
    'Skip adding credits?': 'افزودن اعتبار رد شود؟',
    'Next': 'بعدی',
    'What would you like': 'چه کاری انجام می‌دهید؟',
    'We’ll tailor the interface and tools to fit the way you work.': 'رابط و ابزارها را متناسب با شیوهٔ کار شما تنظیم می‌کنیم.',
    'Office & creative work': 'کارهای اداری و خلاقانه',
    'Edit documents, organize data, create presentations, and more': 'ویرایش اسناد، سامان‌دهی داده‌ها، ساخت ارائه و بیشتر',
    'Coding & development': 'برنامه‌نویسی و توسعه',
    'Edit code, debug issues, run commands, manage project files, and more': 'ویرایش کد، رفع اشکال، اجرای دستورات، مدیریت فایل‌های پروژه و بیشتر',
    'Continue': 'ادامه',
    'Continue setup': 'ادامهٔ راه‌اندازی',
    'How much detail would you like to see?': 'چقدر جزئیات می‌خواهید ببینید؟',
    'This only changes how progress is shown, not what DeepSeek Harness can do.': 'این فقط نحوهٔ نمایش پیشرفت را تغییر می‌دهد، نه توانایی‌های ماه‌ای را.',
    'Results only': 'فقط نتیجه',
    'See just the results in a clean, simple interface': 'فقط نتیجه‌ها را در رابطی تمیز و ساده ببینید',
    'Key details': 'جزئیات کلیدی',
    'Focus on results, with only the most important steps and actions shown': 'تمرکز بر نتیجه، با نمایش مهم‌ترین گام‌ها و اقدام‌ها',
    'Full details': 'جزئیات کامل',
    'See the full process for easier debugging and troubleshooting': 'دیدن کل فرایند برای اشکال‌زدایی آسان‌تر',
    'Open app': 'باز کردن برنامه',
    'Back': 'بازگشت',
    'Skip': 'رد کردن',
    'Skip setup?': 'راه‌اندازی رد شود؟',
    'Got it': 'متوجه شدم',
    'Retry': 'تلاش دوباره',
    'Close': 'بستن',
    'Settings': 'تنظیمات',
    'Feedback': 'بازخورد',
    'Account menu': 'منوی حساب',
    'Account': 'حساب',
    'Signed in to DeepSeek': 'وارد حساب شده‌اید',
    'Not signed in': 'وارد نشده‌اید',
    'Model unavailable. Please sign in and try again.': 'مدل در دسترس نیست. لطفاً وارد شوید و دوباره تلاش کنید.',
    'You have signed out of your account, please log in again.': 'از حساب خود خارج شده‌اید؛ لطفاً دوباره وارد شوید.',
    'Back to DeepSeek Harness': 'بازگشت به ماه‌ای',
    'DeepSeek Harness': 'ماه‌ای',

    /* انتخاب مدل */
    'Select model': 'انتخاب مدل',
    'Loading models…': 'در حال بارگذاری مدل‌ها…',
    'DeepSeek Account': 'حساب DeepSeek',
    'Model': 'مدل',
    'Reasoning effort': 'سطح استدلال',
    'Default': 'پیش‌فرض',
    'Search models…': 'جست‌وجوی مدل‌ها…',
    'Clear search ': 'پاک کردن جست‌وجو',
    'No matching models.': 'مدل منطبقی وجود ندارد.',
    'No models available': 'مدلی در دسترس نیست',
    'No models available.': 'مدلی در دسترس نیست.',
    'No efforts available for this model.': 'این مدل سطح استدلالی ندارد.',
    'This model provides no reasoning effort levels.': 'این مدل سطح استدلالی ندارد.',
    'Select the model for this conversation': 'انتخاب مدل برای این گفت‌وگو',
    'Model and reasoning effort': 'مدل و سطح استدلال',
    'Refreshing model list…': 'در حال نوسازی فهرست مدل‌ها…',
    'Reload': 'بارگذاری دوباره',
    'DeepSeek API key': 'کلید API دیپ‌سیک',
    'Failed to load: {message}': 'بارگذاری ناموفق: {message}',

    /* فعالیت عامل */
    'Analyzing the request': 'تحلیل درخواست',
    'Reading files': 'خواندن فایل‌ها',
    'Reading images': 'خواندن تصاویر',
    'Writing files': 'نوشتن فایل‌ها',
    'Searching code': 'جست‌وجوی کد',
    'Editing files': 'ویرایش فایل‌ها',
    'Running commands': 'اجرای دستورات',
    'Running code': 'اجرای کد',
    'Searching the web': 'جست‌وجوی وب',
    'Visiting web pages': 'بازدید از صفحات وب',
    'Coordinating subagents': 'هماهنگی زیرعامل‌ها',
    'Updating the plan': 'به‌روزرسانی برنامه',
    'Waiting for your action': 'در انتظار اقدام شما',
    'Calling tools': 'فراخوانی ابزارها',
    'Preparing to read files': 'آماده‌سازی خواندن فایل‌ها',
    'Preparing to read images': 'آماده‌سازی خواندن تصاویر',
    'Preparing to write files': 'آماده‌سازی نوشتن فایل‌ها',
    'Preparing to search code': 'آماده‌سازی جست‌وجوی کد',
    'Preparing to edit files': 'آماده‌سازی ویرایش فایل‌ها',
    'Preparing to run commands': 'آماده‌سازی اجرای دستورات',
    'Preparing to run code': 'آماده‌سازی اجرای کد',
    'Preparing to search the web': 'آماده‌سازی جست‌وجوی وب',
    'Preparing to visit web pages': 'آماده‌سازی بازدید صفحات وب',
    'Preparing to coordinate subagents': 'آماده‌سازی هماهنگی زیرعامل‌ها',
    'Preparing to update the plan': 'آماده‌سازی به‌روزرسانی برنامه',
    'Preparing questions': 'آماده‌سازی پرسش‌ها',
    'Preparing tool calls': 'آماده‌سازی فراخوانی ابزارها',
    'Analysis completed': 'تحلیل انجام شد',
    'Read files': 'فایل‌ها خوانده شد',
    'Read images': 'تصاویر خوانده شد',
    'Wrote files': 'فایل‌ها نوشته شد',
    'Searched code': 'کد جست‌وجو شد',
    'Edited files': 'فایل‌ها ویرایش شد',
    'Ran commands': 'دستورات اجرا شد',
    'Ran code': 'کد اجرا شد',
    'Searched the web': 'وب جست‌وجو شد',
    'Visited web pages': 'صفحات وب بازدید شد',
    'Coordinated subagents': 'زیرعامل‌ها هماهنگ شدند',
    'Updated the plan': 'برنامه به‌روزرسانی شد',
    'Asked questions': 'پرسش‌ها مطرح شد',
    'Called tools': 'ابزارها فراخوانی شد',
    'Execution requested': 'درخواست اجرا ثبت شد',
    'Continuing goal': 'ادامهٔ هدف',
    'Task message received': 'پیام کار دریافت شد',
    'Team message received': 'پیام تیم دریافت شد',
    'Subtask status updated': 'وضعیت زیرکار به‌روزرسانی شد',
    'GitHub event received': 'رویداد GitHub دریافت شد',
    'External event received': 'رویداد بیرونی دریافت شد',
    'Background task updated': 'کار پس‌زمینه به‌روزرسانی شد',
    'Plugin status updated': 'وضعیت افزونه به‌روزرسانی شد',
    'This notification triggered this response.': 'این اعلان، این پاسخ را فعال کرد.',
    'Completed': 'انجام شد',
    'Failed': 'ناموفق',
    'Think': 'اندیشیدن',
    'Thought for a while': 'اندکی اندیشید',
    'Stopped': 'متوقف شد',
    'View full image': 'مشاهدهٔ تصویر کامل',
    'Image preview unavailable': 'پیش‌نمایش تصویر در دسترس نیست',
    'Image preview': 'پیش‌نمایش تصویر',
    'Close image preview': 'بستن پیش‌نمایش تصویر',
    'Session statistics': 'آمار گفت‌وگو',
    'Token usage': 'مصرف توکن',
    'LLM time': 'زمان مدل',
    'Tool time': 'زمان ابزارها',
    'Avg time to first token (TTFT)': 'میانگین زمان تا نخستین توکن (TTFT)',
    'Tokens per second (TPS)': 'توکن بر ثانیه (TPS)',
    'Load earlier': 'بارگذاری موارد پیشین',
    'Back to bottom': 'بازگشت به پایین',
    'Deep diving': 'بررسی عمیق',
    'Turn navigation': 'پیمایش نوبت‌ها',
    'Turn usage': 'مصرف نوبت',
    'Performance & usage': 'کارایی و مصرف',
    'Choose how much performance and usage information to show': 'میزان نمایش اطلاعات کارایی و مصرف را انتخاب کنید',
    'Compact': 'فشرده',
    'Detailed': 'با جزئیات',
    'Work details': 'جزئیات کار',
    'Choose how much detail to show for tool calls': 'میزان جزئیات فراخوانی ابزارها را انتخاب کنید',
    'When to Collapse Work Details': 'چه زمانی جزئیات کار جمع شود',
    'Choose when to automatically collapse work details': 'زمان جمع‌شدن خودکار جزئیات کار را انتخاب کنید',
    'On completion': 'پس از پایان',
    'On next message': 'با پیام بعدی',
    'Standard': 'استاندارد',
    'Verbose': 'کامل',
    'Open chat links in': 'باز کردن پیوندهای گفت‌وگو در',
    'Choose where to open web links': 'انتخاب محل باز شدن پیوندهای وب',
    'In-App Sidebar': 'نوار کناری برنامه',
    'Default Browser': 'مرورگر پیش‌فرض',
    'Send behavior while busy': 'رفتار ارسال هنگام مشغول بودن',
    'What Enter and the Send button do while the agent is running; Cmd/Ctrl+Enter uses the other behavior': 'رفتار Enter و دکمهٔ ارسال هنگام اجرای عامل؛ Cmd/Ctrl+Enter رفتار دیگر را انجام می‌دهد',
    'Couldn’t open file': 'باز کردن فایل ممکن نشد',
    'Couldn’t open this file': 'باز کردن این فایل ممکن نشد',
    'Extra content block': 'بلوک محتوای اضافی',
    'System prompt': 'پیام سیستمی',
    'System prompt update': 'به‌روزرسانی پیام سیستمی',
    'Tools updated': 'ابزارها به‌روزرسانی شد',
    'Context injection': 'تزریق زمینه',
    'Session recall': 'یادآوری گفت‌وگو',
    'Replacement catalog': 'فهرست جایگزینی',
    'Supersedes earlier snapshots': 'جایگزین عکس‌های پیشین است',
    'Context compacted': 'زمینه فشرده شد',
    'View compaction summary': 'مشاهدهٔ خلاصهٔ فشرده‌سازی',
    'Compaction summary unavailable': 'خلاصهٔ فشرده‌سازی در دسترس نیست',
    'Unknown content block': 'بلوک محتوای ناشناخته',
    'Branch into a new conversation': 'انشعاب به گفت‌وگوی تازه',
    'Available only on the last message of a completed turn': 'فقط روی آخرین پیام یک نوبت کامل‌شده در دسترس است',
    'Retrying model request': 'تلاش دوباره برای درخواست مدل',
    'Model request retry cancelled': 'تلاش دوبارهٔ درخواست مدل لغو شد',

    /* گفت‌وگو و ارسال */
    'Send message': 'ارسال پیام',
    'Queue message': 'صف کردن پیام',
    'Steer message': 'هدایت پیام',
    'Message delivered': 'پیام تحویل شد',
    'Ask question': 'پرسیدن پرسش',
    'Edit queued message': 'ویرایش پیام صف‌شده',
    'Save queued message': 'ذخیرهٔ پیام صف‌شده',
    'Remove queued message': 'حذف پیام صف‌شده',
    'Steer queued message': 'هدایت پیام صف‌شده',
    'Cancel editing': 'لغو ویرایش',
    'Copied': 'کپی شد',
    'Stop generating': 'توقف تولید',
    'Session unavailable': 'گفت‌وگو در دسترس نیست',
    'Cmd/Ctrl+Enter steers all queued messages': '‏Cmd/Ctrl+Enter همهٔ پیام‌های صف‌شده را هدایت می‌کند',
    'Use the complementary Queue / Steer action': 'از کنش دیگر (صف/هدایت) استفاده کنید',
    'New line': 'خط جدید',
    'Open command menu': 'باز کردن منوی دستورها',
    'Open reference menu': 'باز کردن منوی ارجاع‌ها',
    'Edit failed: this message may have already started sending.': 'ویرایش ناموفق: شاید این پیام در حال ارسال شده باشد.',
    'Removal failed: this message may have already started sending.': 'حذف ناموفق: شاید این پیام در حال ارسال شده باشد.',
    'Steering failed. Try again.': 'هدایت ناموفق بود. دوباره تلاش کنید.',
    'Steering is available only while the agent is running': 'هدایت فقط هنگام اجرای عامل ممکن است',
    'Contains non-text content; editing is not supported yet': 'محتوای غیرمتن دارد؛ ویرایش هنوز پشتیبانی نمی‌شود',
    'Could not fill the draft. Please try again shortly.': 'پر کردن پیش‌نویس ممکن نشد. اندکی بعد دوباره تلاش کنید.',
    'Queued message image': 'تصویر پیام صف‌شده',

    /* پیوست‌ها، فایل‌ها و تصاویر */
    'Pending attachments': 'پیوست‌های در انتظار',
    'Scroll attachments left': 'پیمایش پیوست‌ها به چپ',
    'Scroll attachments right': 'پیمایش پیوست‌ها به راست',
    'Drag files or images here to add them': 'فایل‌ها یا تصاویر را برای افزودن اینجا بکشید',
    'Files and images cannot be added right now': 'فعلاً نمی‌توان فایل یا تصویر افزود',
    'Pending images': 'تصاویر در انتظار',
    'Pending files': 'فایل‌های در انتظار',
    'View original': 'مشاهدهٔ اصلی',
    'Original image': 'تصویر اصلی',
    'Original image preview': 'پیش‌نمایش تصویر اصلی',
    'Close original image preview': 'بستن پیش‌نمایش تصویر اصلی',
    'Only PNG, JPG, WebP, and GIF images are supported': 'فقط تصاویر PNG، JPG، WebP و GIF پشتیبانی می‌شوند',
    'Folders can only be added in the desktop app; add individual files in the browser': 'افزودن پوشه فقط در برنامهٔ رومیزی ممکن است؛ در مرورگر فایل‌های تکی اضافه کنید',
    'Could not obtain the folder path; drag it in again': 'مسیر پوشه به‌دست نیامد؛ دوباره آن را بکشید',
    'The path contains characters a reference cannot carry; rename it and try again': 'مسیر نویسه‌های ناسازگار دارد؛ نامش را تغییر دهید و دوباره تلاش کنید',
    'Image resolution is too high; compress it and try again': 'وضوح تصویر بیش از حد بالاست؛ فشرده‌اش کنید و دوباره تلاش کنید',
    'The current model does not support images; switch to a model that does': 'مدل فعلی تصویر پشتیبانی نمی‌کند؛ مدل دیگری برگزینید',
    'Image failed to load; click to retry': 'بارگذاری تصویر نشد؛ برای تلاش دوباره کلیک کنید',
    'Loading image…': 'در حال بارگذاری تصویر…',
    'The file has not finished uploading; re-add it and try again': 'بارگذاری فایل تمام نشده؛ دوباره اضافه‌اش کنید و تلاش کنید',
    'Files are still uploading; send after they finish': 'فایل‌ها هنوز در حال بارگذاری‌اند؛ پس از پایان بفرستید',
    'Upload failed; click to retry': 'بارگذاری ناموفق بود؛ برای تلاش دوباره کلیک کنید',
    'Session unavailable; files cannot be uploaded': 'گفت‌وگو در دسترس نیست؛ بارگذاری فایل ممکن نیست',

    /* پرسش و پاسخ عامل */
    'These pending questions remain answerable from the composer.': 'این پرسش‌های در انتظار همچنان از پیام‌نویس پاسخ‌پذیرند.',
    'View answers': 'مشاهدهٔ پاسخ‌ها',
    'This question set was cancelled before answers were submitted.': 'این مجموعه‌پرسش پیش از ثبت پاسخ‌ها لغو شد.',
    'This question set was interrupted before answers were submitted.': 'این مجموعه‌پرسش پیش از ثبت پاسخ‌ها قطع شد.',
    'This question is closed; its outcome is in the conversation below.': 'این پرسش بسته شده است؛ نتیجه‌اش در گفت‌وگوی پایین است.',
    'Not answered': 'بی‌پاسخ',

    /* کارها، هدف‌ها و یادآورها */
    'Update to-do list': 'به‌روزرسانی فهرست کارها',
    'Create goal': 'ساخت هدف',
    'View goal': 'مشاهدهٔ هدف',
    'Update goal': 'به‌روزرسانی هدف',
    'Create reminder': 'ساخت یادآور',
    'List reminders': 'فهرست یادآورها',
    'Delete reminder': 'حذف یادآور',
    'Update reminder': 'به‌روزرسانی یادآور',
    'The to-do list is empty': 'فهرست کارها خالی است',
    'Initial list': 'فهرست آغازین',
    'Changes since the previous list': 'تغییرها نسبت به فهرست پیشین',
    'Previous list unavailable': 'فهرست پیشین در دسترس نیست',
    'No changes to the list': 'تغییری در فهرست نیست',
    'Status changed': 'وضعیت تغییر کرد',
    'No goal': 'بدون هدف',
    'Awaiting continuation': 'در انتظار ادامه',
    'Scheduled for': 'زمان‌بندی برای',
    'Overdue, awaiting session resume': 'از موعد گذشته؛ در انتظار ازسرگیری گفت‌وگو',
    'No reminders': 'یادآوری نیست',

    /* ابزارها — عنوان‌های فراخوانی */
    'Inspect providers': 'بازرسی تأمین‌کننده‌ها',
    'Query runtime': 'پرس‌وجوی زمان اجرا',
    'Inspect plugins': 'بازرسی افزونه‌ها',
    'Run workflow': 'اجرای گردش کار',
    'Run ralph loop': 'اجرای حلقهٔ رالف',
    'Read event': 'خواندن رویداد',
    'Search events': 'جست‌وجوی رویدادها',
    'Trace event': 'ردیابی رویداد',
    'Trace session': 'ردیابی گفت‌وگو',
    'List models': 'فهرست مدل‌ها',
    'Create subagent': 'ساخت زیرعامل',
    'List subagents': 'فهرست زیرعامل‌ها',
    'Interrupt agent': 'وقفهٔ عامل',
    'Read job output': 'خواندن خروجی کار',
    'Open terminal': 'باز کردن پایانه',
    'Read terminal': 'خواندن پایانه',
    'List terminals': 'فهرست پایانه‌ها',
    'Signal terminal': 'ارسال سیگنال به پایانه',
    'Close terminal': 'بستن پایانه',
    'Query code symbols': 'پرس‌وجوی نمادهای کد',
    'Find definition': 'یافتن تعریف',
    'Find references': 'یافتن ارجاع‌ها',
    'Find implementation': 'یافتن پیاده‌سازی',
    'Inspect symbol': 'بازرسی نماد',
    'Query Cordis environment': 'پرس‌وجوی محیط Cordis',
    'Read image': 'خواندن تصویر',
    'Create teammate': 'ساخت هم‌تیم',
    'Create team task': 'ساخت کار تیمی',
    'Read team task': 'خواندن کار تیمی',
    'Update team task': 'به‌روزرسانی کار تیمی',
    'List team tasks': 'فهرست کارهای تیمی',
    'Wait for subagent': 'انتظار برای زیرعامل',
    'Cancel background job': 'لغو کار پس‌زمینه',
    'List background jobs': 'فهرست کارهای پس‌زمینه',
    'Tool call': 'فراخوانی ابزار',
    'Preparing tool call': 'آماده‌سازی فراخوانی ابزار',
    'Command arguments': 'آرگومان‌های دستور',
    'Record status': 'وضعیت ثبت',
    'Collapse output': 'جمع کردن خروجی',
    'Collapse diff': 'جمع کردن تفاوت‌ها',
    'Collapse content': 'جمع کردن محتوا',
    'Collapse results': 'جمع کردن نتایج',
    'No output': 'بدون خروجی',
    'No results': 'بدون نتیجه',
    'No results found': 'نتیجه‌ای یافت نشد',
    'Source list truncated': 'فهرست منابع بریده شد',
    'Content truncated': 'محتوا بریده شد',
    'Result limit reached; narrow the search for more': 'به سقف نتیجه رسیدید؛ برای بیشتر، جست‌وجو را محدودتر کنید',

    /* جزئیات ابزار — فیلدها */
    'Recorded result': 'نتیجهٔ ثبت‌شده',
    'Agent response': 'پاسخ عامل',
    'Available models': 'مدل‌های در دسترس',
    'Output truncated': 'خروجی بریده شد',
    'Workflow script': 'اسکریپت گردش کار',
    'Round limit reached': 'به سقف دورها رسید',
    'Remaining work': 'کار باقی‌مانده',
    'Replaced by': 'جایگزین‌شده با',
    'Replacement chain': 'زنجیرهٔ جایگزینی',
    'Replaced events': 'رویدادهای جایگزین‌شده',
    'Source events': 'رویدادهای مبدأ',
    'Derived events': 'رویدادهای مشتق',
    'Ancestor sessions': 'گفت‌وگوهای اجداد',
    'Descendant sessions': 'گفت‌وگوهای نسل بعد',
    'Surrounding events': 'رویدادهای پیرامونی',
    'Subagent activity': 'فعالیت زیرعامل',
    'No active subagents': 'زیرعامل فعالی نیست',
    'Wait timed out': 'مهلت انتظار تمام شد',
    'Change detected': 'تغییری شناسایی شد',
    'Worker reported completion': 'کارگر انجام کار را گزارش کرد',
    'Worker reported a blocker': 'کارگر یک مانع گزارش کرد',
    'Interrupt requested': 'درخواست وقفه ثبت شد',
    'Cancellation requested': 'درخواست لغو ثبت شد',
    'Already finished': 'قبلاً تمام شده است',
    'Signal delivered': 'سیگنال تحویل شد',
    'Exit code': 'کد خروج',
    'Process group': 'گروه فرایند',
    'Event sequence': 'توالی رویداد',
    'Call ID': 'شناسهٔ فراخوانی',
    'Agent ID': 'شناسهٔ عامل',
    'Job ID': 'شناسهٔ کار',
    'Message ID': 'شناسهٔ پیام',
    'Process ID': 'شناسهٔ فرایند',
    'Best match': 'بهترین تطبیق',
    'Target event': 'رویداد هدف',
    'Write scopes': 'دامنه‌های نوشتن',
    'Input schema': 'طرح ورودی',
    'Output schema': 'طرح خروجی',
    'Current package': 'بستهٔ فعلی',
    'Next package': 'بستهٔ بعدی',
    'Latest run': 'آخرین اجرا',

    /* وضعیت‌ها و خطاها */
    'Awaiting approval': 'در انتظار تأیید',
    'Client ready to activate': 'سرویسگیرنده آمادهٔ فعال‌سازی',
    'Run failed': 'اجرا ناموفق',
    'Newer run available': 'اجرای تازه‌تری موجود است',
    'A newer run card is available below': 'کارت اجرای تازه‌تر در پایین موجود است',
    'This package no longer exists': 'این بسته دیگر وجود ندارد',
    'Click again to confirm': 'برای تأیید، دوباره کلیک کنید',
    'Confirm stop': 'توقف را تأیید کنید',
    'Stop failed': 'توقف ناموفق بود',
    'Command failed': 'دستور ناموفق بود',
    'API key is invalid': 'کلید API نامعتبر است',
    'Request quota exhausted.': 'سهمیهٔ درخواست تمام شد.',
    'This turn failed': 'این نوبت ناموفق بود',
    'Output token limit reached': 'به سقف توکن خروجی رسید',
    'Task stopped': 'کار متوقف شد',
    'Sign in to DeepSeek and ensure the request destination supports account authentication.': 'وارد DeepSeek شوید و مطمئن شوید مقصد درخواست از احراز هویت حساب پشتیبانی می‌کند.',
    'Stopped because you signed out of DeepSeek.': 'به‌دلیل خروج از حساب DeepSeek متوقف شد.',
    'The DSH process exited before this turn finished (for example, it was killed, crashed, or timed out while shutting down), so the turn was closed when DSH restarted. Unfinished tool calls have unknown outcomes.': 'فرایند ماه‌ای پیش از پایان این نوبت بسته شد (مثلاً کشتن اجباری، کرش یا اتمام مهلت هنگام خاموشی)؛ پس از راه‌اندازی دوباره، این نوبت نیمه‌کاره بسته شد. نتیجهٔ فراخوانی‌های ناتمام نامعلوم است.',
    'Cache hit': 'اصابت کش',
    'Uncached input': 'ورودی بی‌کش',
    'Cached input': 'ورودی کش‌شده',
    'Cache write': 'نوشتن کش',
    'Provider / model': 'تأمین‌کننده / مدل',
    'Auto review did not authorize this action': 'بازبینی خودکار این عمل را مجاز ندانست',
    'Rejected by Auto review': 'ردشده توسط بازبینی خودکار',

    /* افزونه‌ها و Cordis */
    'Cordis plugins': 'افزونه‌های Cordis',
    'Cordis Plugin': 'افزونهٔ Cordis',
    'Run Cordis Plugin': 'اجرای افزونهٔ Cordis',
    'Stop Cordis Plugin': 'توقف افزونهٔ Cordis',
    'Remove Cordis Plugin': 'حذف افزونهٔ Cordis',
    'Register Cordis Plugin': 'ثبت افزونهٔ Cordis',
    'Update Cordis Plugin': 'به‌روزرسانی افزونهٔ Cordis',
    'Preparing a Cordis tool call': 'آماده‌سازی فراخوانی ابزار Cordis',
    'Cordis approvals': 'تأییدهای Cordis',
    'No plugins defined yet': 'هنوز افزونه‌ای تعریف نشده است',
    'This session': 'این گفت‌وگو',
    'Other sessions': 'سایر گفت‌وگوها',
    'Run controls live in the Cordis panel above Settings': 'کنترل‌های اجرا در پنل Cordis بالای تنظیمات است',
    'Install, enable, and configure plugins': 'نصب، فعال‌سازی و پیکربندی افزونه‌ها',
    'About plugins': 'دربارهٔ افزونه‌ها',
    'Reading plugins…': 'در حال خواندن افزونه‌ها…',
    'Could not read all plugins, possibly due to a network problem': 'خواندن همهٔ افزونه‌ها ممکن نشد؛ شاید به‌خاطر مشکل شبکه',
    'Refresh failed. Please try again.': 'نوسازی ناموفق بود. دوباره تلاش کنید.',
    'No plugins are installed yet.': 'هنوز افزونه‌ای نصب نشده است.',
    'Choose how to add a plugin': 'روش افزودن افزونه را انتخاب کنید',
    'Install a third-party plugin': 'نصب افزونهٔ بیرونی',
    'Supports npm packages, Git repositories, and local directories': 'بسته‌های npm، مخازن Git و پوشه‌های محلی پشتیبانی می‌شوند',
    'This profile applies changes only at startup.': 'این پروفایل تغییرها را فقط هنگام راه‌اندازی اعمال می‌کند.',
    'The change reaches modules DSH itself loaded.': 'تغییر به ماژول‌هایی می‌رسد که ماه‌ای خودش بارگذاری کرده است.',
    'The change reaches a plugin running outside the plugin list.': 'تغییر به افزونه‌ای می‌رسد که بیرون از فهرست افزونه‌ها اجرا می‌شود.',
    'DSH could not compare the loaded plugins with their files.': 'مقایسهٔ افزونه‌های بارگذاری‌شده با فایل‌هایشان ممکن نشد.',
    'Installed plugins': 'افزونه‌های نصب‌شده',
    'Built-in plugin settings': 'تنظیمات افزونه‌های داخلی',
    'Plugin views': 'نمای‌های افزونه',
    'Code source': 'منبع کد',
    'Built in': 'داخلی',
    'Current version': 'نسخهٔ فعلی',
    'This plugin pack contains no components.': 'این بستهٔ افزونه هیچ مؤلفه‌ای ندارد.',
    'Filter components': 'پالایش مؤلفه‌ها',
    'No component matches.': 'مؤلفهٔ منطبقی نیست.',
    'Waiting for dependencies': 'در انتظار وابستگی‌ها',
    'Back to plugins': 'بازگشت به افزونه‌ها',
    'Enter the plugin’s package name, GitHub repository address, or local directory path.': 'نام بستهٔ افزونه، نشانی مخزن GitHub یا مسیر پوشهٔ محلی را وارد کنید.',
    'Package name or address': 'نام بسته یا نشانی',
    'Install guide and examples': 'راهنمای نصب و نمونه‌ها',
    'Hide the guide': 'پنهان کردن راهنما',
    'Example: ': 'نمونه: ',
    'Replace this with the actual Git repository address.': 'به‌جای این، نشانی واقعی مخزن Git را بگذارید.',
    'Replace this with the actual path to your local plugin directory.': 'به‌جای این، مسیر واقعی پوشهٔ افزونهٔ محلی‌تان را بگذارید.',
    'Use example': 'استفاده از نمونه',
    'Defining the plugin': 'در حال تعریف افزونه',
    'Definition failed': 'تعریف ناموفق بود',
    'Definition interrupted': 'تعریف قطع شد',
    'Plugin source': 'منبع افزونه',
    'Allow this version only': 'فقط همین نسخه مجاز باشد',
    'Allow future versions of this plugin': 'نسخه‌های آیندهٔ این افزونه مجاز باشند',
    'Roll back': 'بازگردانی نسخهٔ قبل',
    'Experimental plugins': 'افزونه‌های آزمایشی',
    'Add plugin': 'افزودن افزونه',
    'No such plugin was found': 'چنین افزونه‌ای یافت نشد',
    'Not installed': 'نصب نشده',
    'Rendering failed in the panel; the default UI was restored': 'رندر در پنل ناموفق بود؛ رابط پیش‌فرض بازگردانده شد',
    'Failed to load plugins': 'خطا در بارگذاری افزونه‌ها',

    /* ابزارها و افزونه‌ها — عمومی */
    'Enter a valid package name or address.': 'نام بسته یا نشانی معتبر وارد کنید.',
    'Enter the plugin’s npm package name': 'نام بستهٔ npm افزونه را وارد کنید',
    'What it provides goes away once it is uninstalled.': 'آنچه فراهم می‌کند پس از حذف نصب، از بین می‌رود.',

    /* دستورات */
    'Search…': 'جست‌وجو…',
    'Filter options': 'پالایش گزینه‌ها',
    'Loading options…': 'در حال بارگذاری گزینه‌ها…',
    'Enter or leave plan mode': 'ورود یا خروج از حالت برنامه‌ریزی',

    /* منوی «+» پیام‌نویس — بخش Add و Commands (منوی بازشوی کنار ورودی پیام) */
    'Add': 'افزودن',
    'File': 'فایل',
    'Goal': 'هدف',
    'Plan': 'برنامه',
    'Commands': 'دستورها',
    'History': 'تاریخچه',
    'Permission': 'مجوز',
    'Permissions': 'مجوزها',
    'Export': 'خروجی',
    'Insert': 'درج',
    'Image': 'تصویر',
    'Screenshot': 'نماگرفت',
    'Attach file': 'پیوست فایل',
    'Attach files': 'پیوست فایل‌ها',
    'Add a goal': 'افزودن هدف',
    'Set a goal': 'تنظیم هدف',
    'Enter plan mode': 'ورود به حالت برنامه‌ریزی',
    'Send feedback': 'ارسال بازخورد',
    'Browse history': 'مرور تاریخچه',
    'Switch model': 'تغییر مدل',
    'Export session log': 'خروجی گرفتن از گزارش گفت‌وگو',
    'Export session log as ZIP': 'خروجی گرفتن از گزارش گفت‌وگو به‌صورت ZIP',

    /* رشته‌های «دقیق» منوی «+» — استخراج‌شده از سورس dsh */
    'Set or view the goal for a long-running task': 'تنظیم یا مشاهدهٔ هدفِ کار بلندمدت',
    'Record feedback about this session': 'ثبت بازخورد دربارهٔ این گفت‌وگو',
    'Compact older conversation history': 'فشرده‌سازی تاریخچهٔ پیشین گفت‌وگو',
    'Switch the permission preset (sandbox mode + approval policy)': 'تغییر پیش‌تنظیم مجوز (حالت سندباکس + سیاست تأیید)',
    'Download this Session log as a ZIP archive': 'دانلود گزارش این گفت‌وگو به‌صورت ZIP',
    'Applying…': 'در حال اعمال…',
    'No options': 'گزینه‌ای نیست',
    'Session log download requested.': 'دانلود گزارش گفت‌وگو درخواست شد.',
    'The Web /export command does not accept a path.': 'دستور /export در وب مسیر نمی‌پذیرد.',
    'Upload from your computer': 'بارگذاری از رایانهٔ شما',

    /* صفحهٔ بوت (پیش از رندر React) */
    'HARNESS': 'ماه‌ای',
    'DEEPSEEK': 'ماه‌ای',

    /* اعلان پیش‌نمایش */
    'Preview Notice': 'اطلاعیهٔ پیش‌نمایش',
    'Preview': 'پیش‌نمایش',
    'DeepSeek Harness 0.2 is still in preview, and many areas need continued improvement and refinement. We welcome feedback and suggestions from all developers and users. The new desktop app now targets a broad range of users, while developer-related advanced features can be enabled in the settings. DeepSeek Harness’s product features and plugin APIs are expected to continue rapid iteration and evolution, and will gradually stabilize over time.': 'ماه‌ای ۰٫۲ هنوز در مرحلهٔ پیش‌نمایش است و بسیاری از بخش‌ها نیاز به بهبود و پیرایش مستمر دارند. بازخورد و پیشنهادهای همهٔ توسعه‌دهندگان و کاربران را خوشامد می‌گوییم. برنامهٔ رومیزی جدید اکنون طیف گسترده‌ای از کاربران را هدف گرفته و قابلیت‌های مربوط به توسعه‌دهندگان در تنظیمات فعال می‌شود. انتظار می‌رود قابلیت‌های محصول و APIهای افزونه همچنان با شتاب تغییر و بهبود یابند و به‌تدریج پایدار شوند.',
    'We look forward to exploring the limits of intelligence together with users and developers around the world, building on open-source, reusable, and composable infrastructure. We welcome everyone to bring their ideas to life with DeepSeek Harness and participate in the community to enrich the plugin ecosystem.': 'مشتاقانه منتظر کاوش در مرزهای هوش مصنوعی همراه با کاربران و توسعه‌دهندگان سراسر جهان هستیم؛ بر بستر نرم‌افزار آزاد، بازاستفاده‌پذیر و ترکیب‌پذیر. از همه دعوت می‌کنیم ایده‌های خود را با ماه‌ای به واقعیت تبدیل کنند و در جامعهٔ کاربری مشارکت کنند تا اکوسیستم افزونه‌ها غنی‌تر شود.',

    /* صفحهٔ آغازین (Into the Unknown) */
    'Into the Unknown': 'سفر به ناشناخته‌ها',
    '探索未至之境': 'سفر به ناشناخته‌ها',
    'Choose workspace': 'انتخاب فضای کاری',
    'Choose a workspace to start': 'برای شروع، فضای کاری را انتخاب کنید',
    'Standard mode': 'حالت استاندارد',
    'Add files or run commands': 'افزودن فایل یا اجرای دستورات',

    /* پنل‌های ران‌تایم که از سرور محلی می‌آیند (در بسته‌های استاتیک نیستند) */
    'New Terminal': 'پایانهٔ جدید',
    'Work': 'کار',
    '+ New Session': 'گفت‌وگوی جدید',
    '＋ New Session': 'گفت‌وگوی جدید',
    '+ New session': 'گفت‌وگوی جدید',
    'Message or run a task, / commands, @ files or sessions': 'پیام بنویسید یا کار بدهید؛ /دستورها، @فایل‌ها یا گفت‌وگوها',
    'Describe what you want to build, / commands, @ files or sessions': 'بگویید چه می‌خواهید بسازید؛ /دستورها، @فایل‌ها یا گفت‌وگوها',
    'List of Images': 'فهرست ایمیج‌ها',
    'List of Volumes': 'فهرست والیوم‌ها',
    'List of Valiums': 'فهرست والیوم‌ها',
    'Remove Image': 'حذف ایمیج',
    'Container Removal': 'حذف کانتینر',
    'Entry to the running container': 'ورود به کانتینر در حال اجرا',
    'Cleansing useless things': 'پاک‌سازی موارد بی‌استفاده',
    'Follow the Live Logs': 'دنبال‌کردن لاگ‌های زنده',
    'New Terminal Run orders in the working space…': 'پایانهٔ جدید — اجرای دستورها در فضای کاری…',
    'Workspace files of this conversation': 'فایل‌های فضای کاری این گفت‌وگو',

    /* --- منوی انتخاب حالت عامل (ui-agent-preset) --- */
    'PTC mode': 'حالت PTC',
    'Minimal mode': 'حالت مینیمال',
    'Creator mode': 'حالت خلاق',
    'Work with code, files, and information. Suitable for most tasks, with search, editing, terminal commands, and other tools available as needed.': 'کار با کد، فایل‌ها و اطلاعات؛ مناسب بیشتر کارها. جست‌وجو، ویرایش، دستورهای پایانه و ابزارهای دیگر در صورت نیاز در دسترس‌اند.',
    'Includes all Standard mode capabilities. Better suited to tasks that call tools in batches and then filter, organize, deduplicate, count, or summarize the results.': 'همهٔ توانایی‌های حالت استاندارد را دارد؛ مناسب‌تر برای کارهایی که ابزارها را دسته‌ای فراخوانی می‌کنند و سپس نتایج را پالایش، سامان‌دهی، حذف تکرار، شمارش یا خلاصه می‌کنند.',
    'The agent uses a terminal and image reading, with context compaction. Useful for testing and comparing its basic performance.': 'عامل از پایانه و خواندن تصویر استفاده می‌کند و فشرده‌سازی زمینه هم دارد؛ برای آزمایش و مقایسهٔ کارایی پایه مفید است.',
    'Customize DSH through conversation. Let the agent write plugins that add features or UI, or combine tools and prompts to create your own mode.': 'شخصی‌سازی ماه‌ای از راه گفت‌وگو؛ بگذارید عامل افزونه بنویسد تا قابلیت یا رابط تازه بیفزاید، یا ابزارها و پرسش‌ها را ترکیب کند تا حالت خودتان را بسازید.',
    'Standard mode Work with code, files, and information. Suitable for most tasks, with search, editing, terminal commands, and other tools available as needed.': 'حالت استاندارد — کار با کد، فایل‌ها و اطلاعات؛ مناسب بیشتر کارها. جست‌وجو، ویرایش، دستورهای پایانه و ابزارهای دیگر در صورت نیاز در دسترس‌اند.',
    'PTC mode Includes all Standard mode capabilities. Better suited to tasks that call tools in batches and then filter, organize, deduplicate, count, or summarize the results.': 'حالت PTC — همهٔ توانایی‌های حالت استاندارد را دارد؛ مناسب‌تر برای کارهایی که ابزارها را دسته‌ای فراخوانی می‌کنند و سپس نتایج را پالایش، سامان‌دهی، حذف تکرار، شمارش یا خلاصه می‌کنند.',
    'Minimal mode The agent uses a terminal and image reading, with context compaction. Useful for testing and comparing its basic performance.': 'حالت مینیمال — عامل از پایانه و خواندن تصویر استفاده می‌کند و فشرده‌سازی زمینه هم دارد؛ برای آزمایش و مقایسهٔ کارایی پایه مفید است.',
    'Creator mode Customize DSH through conversation. Let the agent write plugins that add features or UI, or combine tools and prompts to create your own mode.': 'حالت خلاق — شخصی‌سازی ماه‌ای از راه گفت‌وگو؛ بگذارید عامل افزونه بنویسد تا قابلیت یا رابط تازه بیفزاید، یا ابزارها و پرسش‌ها را ترکیب کند تا حالت خودتان را بسازید.',
    'Mode details': 'جزئیات حالت',
    'How to use': 'روش استفاده',
    'Guide sections': 'بخش‌های راهنما',
    'Example task': 'نمونهٔ کار',
    'Copy': 'کپی',
    'Footnotes': 'پانویس‌ها',
    'Choose Standard mode when starting a new task. Describe what you want to accomplish, point to the relevant files, and explain how to check the result.': 'برای آغاز کار جدید حالت استاندارد را برگزینید. بگویید چه می‌خواهید انجام شود، فایل‌های مربوط را نشان دهید و روش بررسی نتیجه را توضیح دهید.',
    'Choose PTC mode when starting a new task. Specify the input files, processing rules, and output format. The agent writes the code.': 'برای آغاز کار جدید حالت PTC را برگزینید. فایل‌های ورودی، قواعد پردازش و قالب خروجی را مشخص کنید؛ نوشتن کد با عامل است.',
    'Choose Minimal mode for a new task. For a comparison, hold the model, permissions, input, and starting workspace state constant across runs.': 'برای کار جدید حالت مینیمال را برگزینید. برای مقایسه، مدل، مجوزها، ورودی و وضعیت آغازین فضای کاری را در همهٔ اجراها ثابت نگه دارید.',
    'Choose Creator mode for a new task. Describe the capability you want, where it should appear, and how you will verify it.': 'برای کار جدید حالت خلاق را برگزینید. قابلیت موردنظر، محل نمایش و روش تأیید آن را شرح دهید.',
    'Agent presets': 'حالت‌های عامل',
    'Choose the agent preset for your new task': 'حالت عامل را برای کار جدیدتان انتخاب کنید',
    'The agent preset chosen when this task started': 'حالت عاملِ انتخاب‌شده هنگام آغاز این کار',
    'Set as new task default': 'به‌عنوان پیش‌فرض کار جدید',
    'View configuration': 'مشاهدهٔ پیکربندی',
    'New task default': 'پیش‌فرض کار جدید',
    'No description.': 'بدون توضیح.',
    'Failed to load': 'بارگذاری ناموفق',
    'Built-in': 'داخلی',
    'Custom': 'سفارشی',
    'Choose the agent’s tools and how it works. Use Standard mode for everyday tasks, or Creator mode to add capabilities to DSH.': 'ابزارها و شیوهٔ کار عامل را انتخاب کنید. برای کارهای روزمره حالت استاندارد و برای افزودن توانایی به ماه‌ای حالت خلاق را به کار ببرید.',
    'Standard mode is unavailable. Restore it or choose another available mode.': 'حالت استاندارد در دسترس نیست؛ آن را بازیابی کنید یا حالت دیگری برگزینید.',
    'Let the agent help me create a preset': 'بگذارید عامل در ساختن یک حالت کمکم کند',
    'Let the agent create a plugin': 'بگذارید عامل افزونه‌ای بسازد',
    'Enter Creator mode and make your own DSH plugin': 'به حالت خلاق بروید و افزونهٔ خودتان را بسازید',
    'Checking whether Creator mode is available': 'بررسی در دسترس بودن حالت خلاق',
    'Temporarily unavailable. Reopen this menu to retry': 'موقتاً در دسترس نیست؛ برای تلاش دوباره این منو را دوباره باز کنید',
    'Creator mode is not included in this configuration': 'این پیکربندی حالت خلاق ندارد',
    /* حالت‌های مجوز */
    'Read Only': 'فقط خواندنی',
    'Workspace Write': 'نوشتن در فضای کاری',
    'Full access': 'دسترسی کامل',
    'Enable Full access?': 'دسترسی کامل فعال شود؟',
    'Full access reduces confirmation steps and lets the agent perform more actions directly, including sensitive operations, file changes, or external commands. Only use it when you trust the current task.': 'دسترسی کامل گام‌های تأیید را کم می‌کند و به عامل اجازه می‌دهد کارهای بیشتری را مستقیم انجام دهد؛ از جمله کارهای حساس، تغییر فایل‌ها یا دستورهای بیرونی. فقط وقتی به کار جاری اعتماد دارید به کار ببرید.',
    'I understand the risks and want to continue': 'ریسک‌ها را می‌دانم و می‌خواهم ادامه دهم',
    'Enable Full access': 'فعال‌سازی دسترسی کامل',
    'Auto review': 'بازبینی خودکار',
    'Run without a sandbox after an experimental same-model review of every native tool call and PTC inner call.': 'اجرای بدون سندباکس، پس از بازبینی آزمایشیِ همان‌مدل برای هر فراخوانی ابزار و فراخوانی درونی PTC.',
    'Enable Auto review (experimental)?': 'بازبینی خودکار (آزمایشی) فعال شود؟',
    'I understand these risks and want to continue': 'این ریسک‌ها را می‌دانم و می‌خواهم ادامه دهم',
    'Enable Auto review': 'فعال‌سازی بازبینی خودکار',
    /* نسخه‌های چینی رشته‌های بالا */
    '标准模式': 'حالت استاندارد',
    'PTC 模式': 'حالت PTC',
    '极简模式': 'حالت مینیمال',
    '创造模式': 'حالت خلاق',
    '处理代码、文件和资料，适合大多数任务。Agent 会按需使用检索、编辑和终端等工具。': 'کار با کد، فایل‌ها و اطلاعات؛ مناسب بیشتر کارها. جست‌وجو، ویرایش، دستورهای پایانه و ابزارهای دیگر در صورت نیاز در دسترس‌اند.',
    '包含标准模式的所有能力，更适合批量调用工具，并对结果进行筛选、整理、去重、统计或汇总的任务。': 'همهٔ توانایی‌های حالت استاندارد را دارد؛ مناسب‌تر برای کارهایی که ابزارها را دسته‌ای فراخوانی می‌کنند و سپس نتایج را پالایش، سامان‌دهی، حذف تکرار، شمارش یا خلاصه می‌کنند.',
    'Agent 使用终端和图片读取工具，并支持上下文压缩，适合测试和对比其基础表现。': 'عامل از پایانه و خواندن تصویر استفاده می‌کند و فشرده‌سازی زمینه هم دارد؛ برای آزمایش و مقایسهٔ کارایی پایه مفید است.',
    '用对话定制 DSH：让 Agent 编写插件，添加新功能或界面；也能组合工具和提示词，创建自己的模式。': 'شخصی‌سازی ماه‌ای از راه گفت‌وگو؛ بگذارید عامل افزونه بنویسد تا قابلیت یا رابط تازه بیفزاید، یا ابزارها و پرسش‌ها را ترکیب کند تا حالت خودتان را بسازید.',
    '选择新任务使用的 Agent 预设': 'حالت عامل را برای کار جدیدتان انتخاب کنید',
    '本任务的 Agent 预设，在任务开始时确定': 'حالت عاملِ انتخاب‌شده هنگام آغاز این کار',
    'Agent 预设': 'حالت‌های عامل',
    '设为新任务默认': 'به‌عنوان پیش‌فرض کار جدید',
    '查看配置': 'مشاهدهٔ پیکربندی',
    '新任务默认': 'پیش‌فرض کار جدید',
    '暂无描述。': 'بدون توضیح.',
    '加载失败': 'بارگذاری ناموفق',
    '内置': 'داخلی',
    '自定义': 'سفارشی',
    '标准模式不可用，请恢复该模式或选择其他可用模式。': 'حالت استاندارد در دسترس نیست؛ آن را بازیابی کنید یا حالت دیگری برگزینید.',
    '仅可查看': 'فقط خواندنی',
    '工作区内修改': 'نوشتن در فضای کاری',
    '完全权限': 'دسترسی کامل',
    '确认启用完全权限？': 'دسترسی کامل فعال شود؟',
    '我已了解风险，并愿意继续': 'ریسک‌ها را می‌دانم و می‌خواهم ادامه دهم',
    '启用完全权限': 'فعال‌سازی دسترسی کامل',
    '自动审查': 'بازبینی خودکار',
    '让 Agent 帮我创建预设模式': 'بگذارید عامل در ساختن یک حالت کمکم کند',
    '让 Agent 创建插件': 'بگذارید عامل افزونه‌ای بسازد',
    '进入创造模式，制作属于你的 DSH 插件': 'به حالت خلاق بروید و افزونهٔ خودتان را بسازید',
    '正在确认创造模式是否可用': 'بررسی در دسترس بودن حالت خلاق',
    '暂时不可用，请重新打开菜单重试': 'موقتاً در دسترس نیست؛ برای تلاش دوباره این منو را دوباره باز کنید',
    '当前配置未提供创造模式': 'این پیکربندی حالت خلاق ندارد',
    '当前包': 'بستهٔ فعلی',
    '下一个包': 'بستهٔ بعدی',

    /* متن دیالوگ شروع */
    'Sign in to your DeepSeek account or add an API Key to get started. Your projects and files are stored locally.': 'برای شروع، به حساب DeepSeek خود وارد شوید یا کلید API اضافه کنید. پروژه‌ها و فایل‌های شما به‌صورت محلی ذخیره می‌شوند.',

    /* --- رشته‌های پویا از موتور --- */
    '/goal describe the objective for a long-running task': '/goal هدفِ کارِ بلندمدت را شرح دهید',
    'describe the objective for a long-running task': 'هدفِ کارِ بلندمدت را شرح دهید',
    'Describe the objective for a long-running task': 'هدفِ کارِ بلندمدت را شرح دهید',
    'Set as default': 'پیش‌فرض کن',
    'Use default': 'استفاده از پیش‌فرض',
    'Make default': 'پیش‌فرض کن',
    'Set default workspace': 'فضای کاری پیش‌فرض',
    'Start': 'شروع',
    'Start task': 'شروع کار',
    'New task': 'کار جدید',
    'Stop': 'توقف',
    'Approve': 'تأیید',
    'Reject': 'رد کردن',
    'Resume': 'از سرگیری',
    'Cancel': 'لغو',
    'Confirm': 'تأیید',
    'Open folder': 'باز کردن پوشه',
    'Choose folder': 'انتخاب پوشه',
    'Change workspace': 'تغییر فضای کاری',
    'What is your goal?': 'هدفتان چیست؟',
    'Describe your goal': 'هدف خود را شرح دهید',
    'Type your message…': 'پیام خود را بنویسید…',
    'Type a message': 'پیامی بنویسید',

    /* --- رشته‌های چینی (پیش‌فرض‌های موتور DeepSeek) --- */
    '默认工作区': 'فضای کاری پیش‌فرض',
    '工作区': 'فضای کاری',
    '新建工作区': 'افزودن فضای کاری',
    '选择工作区': 'انتخاب فضای کاری',
    '新会话': 'گفت‌وگوی جدید',
    '会话': 'گفت‌وگو',
    '设置': 'تنظیمات',
    '插件': 'افزونه‌ها',
    '发送': 'ارسال',
    '停止': 'توقف',
    '搜索': 'جست‌وجو',
    '更多': 'بیشتر',
    '模型': 'مدل',
    '默认': 'پیش‌فرض',
    '取消': 'لغو',
    '确认': 'تأیید',
    '删除': 'حذف',
    '重命名': 'تغییر نام',
    '开始': 'شروع',
    /* چینی — منوی «+» و گفت‌وگوی جدید */
    '工作区文件': 'فایل‌های فضای کاری',
    '新建聊天': 'گفت‌وگوی جدید',
    '新聊天': 'گفت‌وگوی جدید',
    '新建对话': 'گفت‌وگوی جدید',
    '添加': 'افزودن',
    '文件': 'فایل',
    '目标': 'هدف',
    '计划': 'برنامه',
    '反馈': 'بازخورد',
    '命令': 'دستورها',
    '历史': 'تاریخچه',
    '权限': 'مجوز',
    '导出': 'خروجی',
    '图片': 'تصویر',
    '截图': 'نماگرفت',
    '导出会话日志为 ZIP': 'خروجی گرفتن از گزارش گفت‌وگو به‌صورت ZIP',
    '导出会话日志为ZIP': 'خروجی گرفتن از گزارش گفت‌وگو به‌صورت ZIP',
    '压缩': 'فشرده‌سازی',
    '将当前会话内容导出为 ZIP': 'خروجی گرفتن از محتوای گفت‌وگو به‌صورت ZIP',
    '设置或查看长期任务目标': 'تنظیم یا مشاهدهٔ هدف کار بلندمدت',
    '进入或退出计划模式': 'ورود یا خروج از حالت برنامه‌ریزی',
    '发送关于当前会话的反馈': 'ارسال بازخورد دربارهٔ این گفت‌وگو',
    '压缩以上对话内容': 'فشرده‌سازی گفت‌وگوهای پیشین',
    '切换权限预设（沙箱模式与审批策略）': 'تغییر پیش‌تنظیم مجوز (حالت سندباکس + سیاست تأیید)',
    '正在加载选项…': 'در حال بارگذاری گزینه‌ها…',
    '正在应用…': 'در حال اعمال…',
    '无选项': 'گزینه‌ای نیست',
    '添加文件': 'افزودن فایل',
    '上传文件': 'بارگذاری فایل',
    '选择模型': 'انتخاب مدل',
    '切换模型': 'تغییر مدل',
    '查看历史会话': 'مشاهدهٔ گفت‌وگوهای پیشین',
    '浏览历史会话': 'مرور گفت‌وگوهای پیشین',
    /* چینی — جدول i18n ماژول گفت‌وگو */
    'Cordis 插件': 'افزونه‌های Cordis',
    'Cordis 审批': 'تأییدهای Cordis',
    'Client 待激活': 'سرویسگیرنده در انتظار فعال‌سازی',
    'Session ID 已复制': 'شناسهٔ گفت‌وگو کپی شد',
    'Cmd/Ctrl+Enter 插话发送全部排队消息': '‏Cmd/Ctrl+Enter همهٔ پیام‌های صف‌شده را هدایت می‌کند',
    'Token 用量': 'مصرف توکن',
    'DeepSeek 账号': 'حساب DeepSeek',
    'Git 仓库': 'مخزن Git',
    'Host 报告了一个错误': 'میزبان خطایی گزارش کرد',
    'Auto review 已拒绝': 'بازبینی خودکار رد کرد',
    'Auto review 未授权此次操作': 'بازبینی خودکار این عمل را مجاز ندانست',
    '已完成': 'انجام شد',
    '指令失败': 'دستور ناموفق بود',
    '执行中…': 'در حال اجرا…',
    '指令': 'دستور',
    '加载图片…': 'در حال بارگذاری تصویر…',
    '查看大图': 'مشاهدهٔ تصویر کامل',
    '关闭图片预览': 'بستن پیش‌نمایش تصویر',
    '图片预览': 'پیش‌نمایش تصویر',
    '图片无法预览': 'پیش‌نمایش تصویر ممکن نیست',
    '在新对话中分支': 'انشعاب به گفت‌وگوی تازه',
    '仅可从已完成轮次的最后一条消息分支': 'انشعاب فقط از آخرین پیام یک نوبت کامل‌شده ممکن است',
    '上下文已压缩': 'زمینه فشرده شد',
    '点击查看压缩摘要': 'برای مشاهدهٔ خلاصهٔ فشرده‌سازی کلیک کنید',
    '正在压缩…': 'در حال فشرده‌سازی…',
    '压缩摘要不可用': 'خلاصهٔ فشرده‌سازی در دسترس نیست',
    '替换目录': 'فهرست جایگزینی',
    '已新增': 'افزوده شد',
    '已载入': 'بارگذاری شد',
    '已移除': 'حذف شد',
    '已更新': 'به‌روزرسانی شد',
    '已截断': 'بریده شد',
    '取代先前的快照': 'جایگزین عکس‌های پیشین است',
    '上下文注入': 'تزریق زمینه',
    '跨会话召回': 'یادآوری بین‌گفت‌وگو',
    '附加内容块': 'بلوک محتوای اضافی',
    '请先登录 DeepSeek，并确认请求地址支持账号认证。': 'نخست وارد DeepSeek شوید و مطمئن شوید مقصد درخواست از احراز هویت حساب پشتیبانی می‌کند.',
    '任务已因退出 DeepSeek 登录而停止。': 'کار به‌دلیل خروج از حساب DeepSeek متوقف شد.',
    'API 密钥无效': 'کلید API نامعتبر است',
    'DSH 进程在本轮完成前退出（例如被强制结束、崩溃或关闭超时），重新启动后本轮已中止。未完成的工具调用结果未知。': 'فرایند ماه‌ای پیش از پایان این نوبت بسته شد (مثلاً کشتن اجباری، کرش یا اتمام مهلت هنگام خاموشی)؛ پس از راه‌اندازی دوباره این نوبت نیمه‌کاره بسته شد. نتیجهٔ فراخوانی‌های ناتمام نامعلوم است.',
    '当前请求的额度已用尽': 'سهمیهٔ درخواست فعلی تمام شد',
    '已达到输出 token 上限': 'به سقف توکن خروجی رسید',
    '回答被截断，已有输出保留在对话中。发送“继续”可让模型接着输出。': 'پاسخ بریده شد؛ خروجی فعلی در گفت‌وگو مانده است. «ادامه» را بفرستید تا مدل ادامه دهد.',
    '正在重试模型请求': 'در حال تلاش دوباره برای درخواست مدل',
    '模型请求重试已取消': 'تلاش دوبارهٔ درخواست مدل لغو شد',
    '重试延迟：': 'تأخیر تلاش دوباره: ',
    '失败原因：': 'علت خطا: ',
    '等待重试模型请求': 'در انتظار تلاش دوبارهٔ درخواست مدل',
    '已重试模型请求': 'درخواست مدل دوباره اجرا شد',
    '正在运行代码': 'در حال اجرای کد',
    '正在运行命令': 'در حال اجرای دستورات',
    '运行了代码': 'کد اجرا شد',
    '执行了命令': 'دستورات اجرا شد',
    '修改了文件': 'فایل‌ها ویرایش شد',
    '更新了计划': 'برنامه به‌روزرسانی شد',
    '向用户提出了问题': 'از کاربر پرسش شد',
    '已读取文件': 'فایل‌ها خوانده شد',
    '已读取图片': 'تصاویر خوانده شد',
    '已搜索代码': 'کد جست‌وجو شد',
    '已协调子智能体': 'زیرعامل‌ها هماهنگ شدند',
    '已完成分析': 'تحلیل انجام شد',
    '已调用工具': 'ابزارها فراخوانی شد',
    '已访问网页': 'صفحات وب بازدید شد',
    '已搜索网页': 'وب جست‌وجو شد',
    '已写入文件': 'فایل‌ها نوشته شد',
    '正在编辑文件': 'در حال ویرایش فایل‌ها',
    '正在更新计划': 'در حال به‌روزرسانی برنامه',
    '准备运行代码': 'آماده‌سازی اجرای کد',
    '准备运行命令': 'آماده‌سازی اجرای دستورات',
    '准备编辑文件': 'آماده‌سازی ویرایش فایل‌ها',
    '准备更新计划': 'آماده‌سازی به‌روزرسانی برنامه',
    '准备提问': 'آماده‌سازی پرسش‌ها',
    '准备读取文件': 'آماده‌سازی خواندن فایل‌ها',
    '准备读取图片': 'آماده‌سازی خواندن تصاویر',
    '准备搜索代码': 'آماده‌سازی جست‌وجوی کد',
    '准备协调子智能体': 'آماده‌سازی هماهنگی زیرعامل‌ها',
    '准备调用工具': 'آماده‌سازی فراخوانی ابزارها',
    '准备访问网页': 'آماده‌سازی بازدید صفحات وب',
    '准备搜索网页': 'آماده‌سازی جست‌وجوی وب',
    '准备写入文件': 'آماده‌سازی نوشتن فایل‌ها',
    '等待你的操作': 'در انتظار اقدام شما',
    '正在读取文件': 'در حال خواندن فایل‌ها',
    '正在读取图片': 'در حال خواندن تصاویر',
    '正在搜索代码': 'در حال جست‌وجوی کد',
    '正在协调子智能体': 'در حال هماهنگی زیرعامل‌ها',
    '正在分析请求': 'در حال تحلیل درخواست',
    '正在调用工具': 'در حال فراخوانی ابزارها',
    '正在访问网页': 'در حال بازدید صفحات وب',
    '正在搜索网页': 'در حال جست‌وجوی وب',
    '正在写入文件': 'در حال نوشتن فایل‌ها',
    '本轮运行失败': 'این نوبت ناموفق بود',
    '处理失败': 'پردازش ناموفق',
    '本轮用量': 'مصرف نوبت',
    '缓存命中': 'اصابت کش',
    '缓存读取': 'خواندن کش',
    '缓存写入': 'نوشتن کش',
    '未缓存输入': 'ورودی بی‌کش',
    '输出': 'خروجی',
    '提供方 / 模型': 'تأمین‌کننده / مدل',
    '未知内容块': 'بلوک محتوای ناشناخته',
    '会话统计': 'آمار گفت‌وگو',
    '输出速度（TPS）': 'سرعت خروجی (TPS)',
    '工具调用用时': 'زمان ابزارها',
    '首 token 平均（TTFT）': 'میانگین تا نخستین توکن (TTFT)',
    '系统提示词': 'پیام سیستمی',
    '系统提示词更新': 'به‌روزرسانی پیام سیستمی',
    '任务已停止': 'کار متوقف شد',
    '思考': 'اندیشیدن',
    '已思考': 'اندکی اندیشید',
    '工具已更新': 'ابزارها به‌روزرسانی شد',
    '收到任务消息': 'پیام کار دریافت شد',
    '这条通知触发了本轮回复。': 'این اعلان این پاسخ را فعال کرد.',
    '收到 GitHub 事件': 'رویداد GitHub دریافت شد',
    '继续执行目标': 'ادامهٔ هدف',
    '后台任务状态更新': 'وضعیت کار پس‌زمینه به‌روزرسانی شد',
    '插件状态更新': 'وضعیت افزونه به‌روزرسانی شد',
    '收到执行请求': 'درخواست اجرا دریافت شد',
    '自动化任务': 'کار خودکار',
    '收到团队消息': 'پیام تیم دریافت شد',
    '收到外部事件': 'رویداد بیرونی دریافت شد',
    '子任务状态更新': 'وضعیت زیرکار به‌روزرسانی شد',
    '、': '، ',

    /* --- پنل ابزارهای فضای کاری و نوار وضعیت --- */
    'Workspace files': 'فایل‌های فضای کاری',
    "Browse files in this session's workspace": 'مرور فایل‌های فضای کاری این گفت‌وگو',
    'Browse files in this session\u2019s workspace': 'مرور فایل‌های فضای کاری این گفت‌وگو',
    'New terminal': 'پایانهٔ جدید',
    'Run commands in the Session workspace': 'اجرای دستورها در فضای کاری گفت‌وگو',
    'Run commands': 'اجرای دستورها',
    'More tools': 'ابزارهای بیشتر',

    /* --- منوی افزونه‌ها و پنل‌های ران‌تایم سرور (اسکرین‌شات کاربر ۳۰ اکتبر) --- */
    'Trajectory': 'مسیر اجرا',
    'Browse other plugins': 'مرور افزونه‌های دیگر',
    'Create your plugin': 'ساخت افزونهٔ خودتان',
    'Browse plugins': 'مرور افزونه‌ها',
    'Create plugin': 'ساخت افزونه',
    'Create a plugin': 'ساخت افزونه',
    'My plugins': 'افزونه‌های من',
    'Plugin details': 'جزئیات افزونه',
    'Install': 'نصب',
    'Uninstall': 'حذف نصب',
    'Enable': 'فعال‌سازی',
    'Disable': 'غیرفعال‌سازی',
    'Enabled': 'فعال',
    'Disabled': 'غیرفعال',
    'Version': 'نسخه',
    'Author': 'سازنده',
    'Source': 'منبع',
    /* معادل‌های چینی همان پنل‌ها — سرور ممکن است رشتهٔ چینی سرو کند */
    '轨迹': 'مسیر اجرا',
    '浏览其他插件': 'مرور افزونه‌های دیگر',
    '创建你的插件': 'ساخت افزونهٔ خودتان',
    '创建您的插件': 'ساخت افزونهٔ خودتان',
    '浏览插件': 'مرور افزونه‌ها',
    '创建插件': 'ساخت افزونه',
    '我的插件': 'افزونه‌های من',
    '新建终端': 'پایانهٔ جدید',
    '更多工具': 'ابزارهای بیشتر',
    '执行命令': 'اجرای دستورها',
    'commands, @ files or sessions': 'دستورها، @فایل‌ها یا گفت‌وگوها',
    '… commands, @ files or sessions': '… دستورها، @فایل‌ها یا گفت‌وگوها',
    '…tok/s': '…توکن/ث'
  };

  /* ---------- ۳) قواعد الگویی (برای رشته‌های پویا) ---------- */
  /* ارقام فارسی برای خروجی الگوها — ترتیب bidi در متن فارسی را هم درست می‌کند */
  var FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function faNum(s) {
    return String(s)
      .replace(/[0-9]/g, function (d) { return FA_DIGITS[+d]; })
      .replace(/([۰-۹])\.([۰-۹])/g, '$1\u066B$2'); /* ممیز اعشار فارسی */
  }
  var R = [
    [/^Preparing to (.+)$/u, function (m) {
      var map = {
        'read files': 'خواندن فایل‌ها', 'read images': 'خواندن تصاویر',
        'write files': 'نوشتن فایل‌ها', 'search code': 'جست‌وجوی کد',
        'edit files': 'ویرایش فایل‌ها', 'run commands': 'اجرای دستورات',
        'run code': 'اجرای کد', 'search the web': 'جست‌وجوی وب',
        'visit web pages': 'بازدید صفحات وب', 'coordinate subagents': 'هماهنگی زیرعامل‌ها',
        'update the plan': 'به‌روزرسانی برنامه'
      };
      return map[m[1]] ? 'آماده‌سازی ' + map[m[1]] : null;
    }],
    [/^Completed in (.+)$/u, function (m) { return 'انجام شد در ' + m[1]; }],
    [/^Describe (what|how) .*$/u, function () { return 'چه کاری می‌خواهید انجام شود؟ توضیح دهید…'; }],
    [/^Loading (models|options)…?$/u, function (m) { return m[1] === 'models' ? 'در حال بارگذاری مدل‌ها…' : 'در حال بارگذاری گزینه‌ها…'; }],
    [/^(Search|Filter) (models|sessions|options)…?$/u, function (m) {
      var o = { models: 'مدل‌ها', sessions: 'گفت‌وگوها', options: 'گزینه‌ها' };
      return (m[1] === 'Search' ? 'جست‌وجوی ' : 'پالایش ') + o[m[2]] + '…';
    }],
    /* «Completed in 12s» گاهی به چند گرهٔ جدا می‌شکند — تکه‌ها را هم پوشش بده */
    [/^Completed in$/u, function () { return 'انجام شد در'; }],
    [/^in (\d+(?:[.,]\d+)?)ms$/u, function (m) { return 'در ' + faNum(m[1]) + ' میلی‌ثانیه'; }],
    [/^(\d+(?:[.,]\d+)?)s$/u, function (m) { return faNum(m[1]) + ' ثانیه'; }],
    [/^(\d+(?:[.,]\d+)?)m$/u, function (m) { return faNum(m[1]) + ' دقیقه'; }],
    [/^tok\/s$/u, function () { return 'توکن/ث'; }],

    /* واژه‌های کوتاه منو — تطبیق لنگرشدهٔ کل گره */
    [/^\s*(add|file|goal|plan|feedback|commands?|history|permissions?|compact|export|model|insert|image|screenshot)\s*$/iu, function (m) {
      var w = m[1].toLowerCase();
      if (w === 'commands') return 'دستورها';
      if (w === 'command') return 'دستور';
      if (w === 'permissions') return 'مجوزها';
      var map = {
        add: 'افزودن', file: 'فایل', goal: 'هدف', plan: 'برنامه', feedback: 'بازخورد',
        history: 'تاریخچه', permission: 'مجوز', compact: 'فشرده‌سازی', export: 'خروجی',
        model: 'مدل', insert: 'درج', image: 'تصویر', screenshot: 'نماگرفت'
      };
      return map[w] || null;
    }],

    /* نوار وضعیت و رشته‌های ترکیبی */
    [/^Could not switch to (.+): (.+)$/u, function (m) { return 'جابه‌جایی به «' + m[1] + '» انجام نشد: ' + m[2]; }],
    [/^Access mode, current: (.+)$/u, function (m) { return 'حالت دسترسی، فعلی: ' + m[1]; }],
    [/^\s*(\d+(?:[.,]\d+)?)\s*tok\/s\s*$/u, function (m) { return faNum(m[1]) + ' توکن/ث'; }],
    [/^\s*(\d+(?:[.,]\d+)?)\s*%\s*$/u, function (m) { return faNum(m[1]) + '٪'; }],
    /* نوار وضعیت: «3 turns 12 steps» / «1 turn 0 steps» — با ارقام فارسی تا ترتیب bidi نشکند */
    [/^(\d+)\s+turns?\s+(\d+)\s+steps?$/iu, function (m) { return faNum(m[1]) + ' نوبت · ' + faNum(m[2]) + ' گام'; }],
    [/^(\d+)\s+turns?$/iu, function (m) { return faNum(m[1]) + ' نوبت'; }],
    [/^(\d+)\s+turns?\s+(performed|pending|planned)$/iu, function (m) {
      var w = { performed: 'انجام‌شده', pending: 'در انتظار', planned: 'برنامه‌ریزی‌شده' }[m[2].toLowerCase()];
      return faNum(m[1]) + ' نوبت ' + w;
    }],
    [/^(\d+)\s+steps?$/iu, function (m) { return faNum(m[1]) + ' گام'; }],
    [/^Cache hit (\d+(?:[.,]\d+)?)%$/iu, function (m) { return 'اصابت کش ' + faNum(m[1]) + '٪'; }],
    [/^Cache hit (\d+(?:[.,]\d+)?)٪$/u, function (m) { return 'اصابت کش ' + faNum(m[1]) + '٪'; }],
    [/^Retry delay:\s*(.*)$/u, function (m) { return 'تأخیر تلاش دوباره: ' + m[1]; }],
    [/^Failure reason:\s*(.*)$/u, function (m) { return 'علت خطا: ' + m[1]; }],
    [/^Tool added: (.+)$/u, function (m) { return 'ابزار افزوده شد: ' + m[1]; }],
    [/^Tool removed: (.+)$/u, function (m) { return 'ابزار حذف شد: ' + m[1]; }],
    [/^Tool was not executed\. Reason: (.+)$/u, function (m) { return 'ابزار اجرا نشد. دلیل: ' + m[1]; }],
    [/^Unknown surface event: (.+)$/u, function (m) { return 'رویداد surface ناشناخته: ' + m[1]; }],

    /* عنوان پنل‌ها و محتوای ران‌تایم (اسکرین‌شات کاربر) */
    [/^Explanation about (.+)$/u, function (m) { return 'توضیح دربارهٔ ' + m[1]; }],
    [/^Explanation abo…?$/u, function () { return 'توضیح دربارهٔ…'; }],
    [/^orders in the working space[.…]?$/iu, function () { return 'اجرای دستورها در فضای کاری…'; }],
    [/^workspace files of this conversation[.…]?$/iu, function () { return 'فایل‌های فضای کاری این گفت‌وگو…'; }],
    [/^Browse workspace files of this conversation[.…]?$/iu, function () { return 'مرور فایل‌های فضای کاری این گفت‌وگو…'; }],

    /* گفت‌وگوها و لیست‌ها */
    [/^Show (\d+) more sessions$/u, function (m) { return 'نمایش ' + faNum(m[1]) + ' گفت‌وگوی بیشتر'; }],
    [/^Jump to turn (\d+)$/u, function (m) { return 'پرش به نوبت ' + faNum(m[1]); }],
    [/^Load and jump to turn (\d+)$/u, function (m) { return 'بارگذاری و پرش به نوبت ' + faNum(m[1]); }],
    [/^Expand (\d+) more diff lines$/u, function (m) { return 'نمایش ' + faNum(m[1]) + ' خط تفاوت بیشتر'; }],
    [/^Expand (\d+) more result lines$/u, function (m) { return 'نمایش ' + faNum(m[1]) + ' خط نتیجهٔ بیشتر'; }],
    [/^Expand (\d+) more lines$/u, function (m) { return 'نمایش ' + faNum(m[1]) + ' خط بیشتر'; }],
    [/^Expand (\d+) collapsed output lines$/u, function (m) { return 'باز کردن ' + faNum(m[1]) + ' خط خروجی جمع‌شده'; }],
    [/^Show (\d+) more lines$/u, function (m) { return 'نمایش ' + faNum(m[1]) + ' خط بیشتر'; }],
    [/^Command line (\d+)$/u, function (m) { return 'خط فرمان ' + faNum(m[1]); }],
    [/^Hide live output of (.+)$/u, function (m) { return 'پنهان کردن خروجی زندهٔ ' + m[1]; }],
    [/^Show live output of (.+)$/u, function (m) { return 'نمایش خروجی زندهٔ ' + m[1]; }],
    [/^New session in (.+)$/u, function (m) { return 'گفت‌وگوی جدید در ' + m[1]; }],
    [/^Session actions for (.+)$/u, function (m) { return 'کنش‌های گفت‌وگو برای ' + m[1]; }],
    [/^Workspace actions for (.+)$/u, function (m) { return 'کنش‌های فضای کاری برای ' + m[1]; }],
    [/^Stop task (.+)$/u, function (m) { return 'توقف کار ' + m[1]; }],
    [/^Remove file (.+)$/u, function (m) { return 'حذف فایل ' + m[1]; }],
    [/^Remove image (.+)$/u, function (m) { return 'حذف تصویر ' + m[1]; }],
    [/^Retry uploading (.+)$/u, function (m) { return 'تلاش دوباره برای بارگذاری ' + m[1]; }],
    [/^Queued file (.+)$/u, function (m) { return 'فایل صف‌شده ' + m[1]; }],
    [/^A workspace named “(.+)” already exists\.$/u, function (m) { return 'فضای کاری با نام «' + m[1] + '» از قبل وجود دارد.'; }],
    [/^This removes “(.+)” from the workspace list\. The folder and session logs will be kept\. Its sessions will appear under Ungrouped\.$/u, function (m) {
      return '«' + m[1] + '» از فهرست فضاهای کاری حذف می‌شود. پوشه و گزارش گفت‌وگوها نگه داشته می‌شود و گفت‌وگوهایش زیر «گروه‌بندی‌نشده» می‌روند.';
    }],
    [/^Model operation failed: (.+)$/u, function (m) { return 'عملیات مدل ناموفق بود: ' + m[1]; }],
    [/^Failed to load history: (.+)$/u, function (m) { return 'بارگذاری تاریخچه ناموفق بود: ' + m[1]; }],
    [/^Catalog failed to load: (.+)$/u, function (m) { return 'بارگذاری کاتالوگ ناموفق بود: ' + m[1]; }],
    [/^Reading the plugin inventory failed: (.+)$/u, function (m) { return 'خواندن فهرست افزونه‌ها ناموفق بود: ' + m[1]; }],
    [/^New session failed: (.+)$/u, function (m) { return 'گفت‌وگوی جدید ناموفق بود: ' + m[1]; }],
    [/^Loading failed: (.+)$/u, function (m) { return 'بارگذاری ناموفق بود: ' + m[1]; }],

    /* پیوست و تصویر — الگوها */
    [/^Image limit: up to (\d+) images, ([^ ]+) each$/iu, function (m) { return 'محدودیت تصویر: حداکثر ' + faNum(m[1]) + ' تصویر، هرکدام ' + m[2]; }],
    [/^Each image must be smaller than (.+)$/u, function (m) { return 'هر تصویر باید کوچک‌تر از ' + m[1] + ' باشد'; }],
    [/^Image sides must be at most (.+)px; downscale it and try again$/iu, function (m) { return 'اضلاع تصویر حداکثر ' + m[1] + ' پیکسل؛ کوچک‌ترش کنید و دوباره تلاش کنید'; }],
    [/^A message can include up to (\d+) images$/iu, function (m) { return 'هر پیام حداکثر ' + faNum(m[1]) + ' تصویر می‌پذیرد'; }],
    [/^Images exceed (.+) in total; remove some and try again$/iu, function (m) { return 'مجموع تصاویر از ' + m[1] + ' بیشتر است؛ چند مورد را حذف کنید'; }],
    [/^Sending images failed \((.+)\); re-add them and try again$/iu, function (m) { return 'ارسال تصاویر ناموفق بود (' + m[1] + ')؛ دوباره اضافه کنید'; }],

    /* زمان‌بندی و یادآورها */
    [/^Every day at (.+)$/u, function (m) { return 'هر روز ساعت ' + m[1]; }],
    [/^Weekly on (.+)$/u, function (m) { return 'هفتگی: ' + m[1]; }],
    [/^Running for (.+)$/u, function (m) { return 'در حال اجرا: ' + m[1]; }],
    [/^Deep diving for (.+) ···$/u, function (m) { return 'بررسی عمیق از ' + m[1] + ' ···'; }],
    [/^Showing the first (\d+) results\. Narrow your search\.$/u, function (m) { return faNum(m[1]) + ' نتیجهٔ اول نشان داده می‌شود. جست‌وجو را محدودتر کنید.'; }],

    /* فشرده‌سازی و ارجاع */
    [/^Compacted (\d+) history items \(~([^)]+) tokens\)$/u, function (m) { return faNum(m[1]) + ' آیتم تاریخچه فشرده شد (حدود ' + faNum(m[2]) + ' توکن)'; }],
    [/^Referenced session · (.+)$/u, function (m) { return 'گفت‌وگوی مرجع · ' + m[1]; }],
    [/^From session (.+)$/u, function (m) { return 'از گفت‌وگو: ' + m[1]; }],
    [/^(\d+) tok$/u, function (m) { return faNum(m[1]) + ' توکن'; }],
    [/^用量 (\d+)$/, function (m) { return 'مصرف: ' + m[1]; }],
    [/^(\d+) 条消息$/, function (m) { return m[1] + ' پیام'; }],
    [/^(\d+) 个 subagent$/, function (m) { return m[1] + ' زیرعامل'; }],
    [/^(\d+) 次工具调用$/, function (m) { return m[1] + ' فراخوانی ابزار'; }],
    [/^(\d+) 轮 (\d+) 步$/, function (m) { return m[1] + ' نوبت · ' + m[2] + ' گام'; }],
    [/^缓存命中 (\d+(?:[.,]\d+)?)%$/, function (m) { return 'اصابت کش ' + m[1] + '٪'; }],
    [/^(.+)（(\d+)\/(\d+)） · (\d+)s$/, function (m) { return m[1] + ' (' + m[2] + '/' + m[3] + ') · ' + m[4] + ' ثانیه'; }],
    [/^新增 (\d+) 个$/, function (m) { return m[1] + ' مورد افزوده شد'; }],
    [/^移除 (\d+) 个$/, function (m) { return m[1] + ' مورد حذف شد'; }],
    [/^新增 (\d+) 个，移除 (\d+) 个$/, function (m) { return m[1] + ' مورد افزوده و ' + m[2] + ' مورد حذف شد'; }],
    [/^…还有 (\d+) 条$/, function (m) { return '…' + m[1] + ' مورد دیگر'; }],
    [/^保留 (\d+) 条 · 省略 (\d+) 条$/, function (m) { return m[1] + ' مورد ماند · ' + m[2] + ' مورد حذف شد'; }],
    [/^来自会话 (.+)$/, function (m) { return 'از گفت‌وگو: ' + m[1]; }],
    [/^已压缩 (\d+) 条历史记录（约 (.+) tokens）$/, function (m) { return m[1] + ' آیتم تاریخچه فشرده شد (حدود ' + m[2] + ' توکن)'; }]
  ];

  /* ---------- ۴) مترجم گرهٔ متنی ---------- */
  function translateText(s) {
    if (!s) return null;
    var t = s.trim();
    if (t.length < 2 || t.length > 1200) return null;
    if (D[t] !== undefined && D[t] !== t) return D[t];
    for (var i = 0; i < R.length; i++) {
      var m = t.match(R[i][0]);
      if (m) { var out = R[i][1](m); if (out) return out; }
    }
    return null;
  }

  var SKIP_TEXT = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'KBD', 'SAMP', 'TEXTAREA']);
  /* برای ویژگی‌ها (placeholder و…) textarea نباید رد شود — محتوای کاربر دست‌نخورده می‌ماند،
     فقط برچسب راهنما ترجمه می‌شود. */
  var SKIP_ATTR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'KBD', 'SAMP']);
  function shouldSkip(el, set) {
    var s = set || SKIP_TEXT;
    var n = el;
    while (n && n !== html) {
      if (s.has(n.nodeName)) return true;
      if (n.nodeType === 1) {
        /* متن قابل‌ویرایش کاربر هرگز ترجمه نمی‌شود */
        if (n.getAttribute && n.getAttribute('contenteditable') === 'true') return true;
        var cl = n.getAttribute && n.getAttribute('class');
        if (typeof cl === 'string' && /hljs|token|monaco|cm-|highlight/.test(cl)) return true;
      }
      n = n.parentNode;
    }
    return false;
  }

  function walk(root) {
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = node.parentElement;
        if (!p || shouldSkip(p, SKIP_TEXT)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var changes = [];
    while (tw.nextNode()) {
      var node = tw.currentNode;
      var fa = translateText(node.nodeValue);
      if (fa) changes.push([node, fa]);
    }
    for (var i = 0; i < changes.length; i++) {
      var n = changes[i][0];
      n.nodeValue = changes[i][1];
      rtlFit(n);
    }
  }

  /* ---------- ۴٫۵) راست‌چین‌سازی داده‌محور (v10) ----------
     به‌جای dir="rtl" سراسری (که در v7 اسکلت صفحه را آینه و نیمه
     می‌کرد)، فقط «محفظهٔ متنی ساده‌ای که متن فارسی گرفت» راست‌چین
     می‌شود:
       • ردیف flex با حداکثر ۴ فرزند ساده (آیکن+برچسب منوها و
         آیتم‌های سایدبار) → آینه می‌شود؛ آیکن راست، متن راست‌چین.
       • بلوک سادهٔ متن (تیتر، برچسب، کارت) → text-align به راست
         می‌رود و آیکن‌های بالای کارت هم راست می‌افتند.
     محفظه‌های پیچیده (ستون‌های اصلی صفحه، سایدبار، شبکه‌های تو در تو،
     ورودی‌ها و کدها) هرگز flip نمی‌شوند — بدترین حالت فقط «یک ردیف»
     است، نه نصفه‌شدن صفحه. چون فقط پس از فارسی‌شدنِ متن همان محفظه
     رخ می‌دهد، ردیف‌های انگلیسی/کد سرِ جایشان می‌مانند. */
  function rtlIsSvg(e) {
    /* آیکن‌های svg (lucide و...) در شمارش عمق خنثی‌اند */
    return !!e && (e.tagName === 'svg' || e.namespaceURI === 'http://www.w3.org/2000/svg');
  }
  function rtlSimpleContainer(el) {
    /* همهٔ فرزندان عنصری باید برگ یا یک ردیف سادهٔ برگ‌ها باشند (عمق ≤۲)؛
       svg آیکن‌ها خنثی‌اند و شمرده نمی‌شوند */
    var kids = el.children;
    if (!kids || kids.length > 4) return false;
    for (var i = 0; i < kids.length; i++) {
      if (rtlIsSvg(kids[i])) continue;
      var gk = kids[i].children;
      if (!gk || gk.length === 0) continue;         /* برگ — خوب */
      if (gk.length > 4) return false;              /* فرزند شلوغ — رد شو */
      for (var j = 0; j < gk.length; j++) {
        if (rtlIsSvg(gk[j])) continue;
        if (gk[j].children && gk[j].children.length) return false; /* عمق ۳ — ممنوع */
      }
    }
    return true;
  }
  function rtlCanFlip(el) {
    if (!el || el === document.body || el === html) return false;
    var id = el.id || '';
    if (id === 'mahai-brandbar' || id === 'mahai-hero' || id === 'mahai-hero-tag' ||
        id === 'root' || id === 'app' || id.indexOf('mahai-') === 0) return false;
    /* ورودی، کد، رسانه و محتوای کاربر هرگز داخل flip نیایند */
    if (el.querySelector && el.querySelector('input,textarea,select,code,pre,canvas,video,iframe,embed,object,[contenteditable="true"]')) return false;
    return true;
  }
  function rtlFit(textNode) {
    /* زنجیرهٔ «محفظه‌های ساده» را از برگ به بالا بساز (سقف ۳ سطح) و
       بالاترین محفظهٔ سادهٔ زنجیره را flip کن — تا «کل کارت/کل منو»
       راست‌چین شود، نه فقط تیترش. اگر زنجیره به محفظهٔ پیچیده
       (ستون‌های اصلی صفحه، ورودی‌ها، کدها) خورد، همان‌جا قطع می‌شود. */
    var chain = [];
    var n = textNode.parentElement;
    for (var depth = 0; n && n !== document.body && depth < 5 && chain.length < 3; depth++) {
      var d;
      try { d = getComputedStyle(n); } catch (e) { return; }
      if (d.direction === 'rtl') return;            /* جدِ راست‌چین هست — کافی است */
      var disp = d.display;
      if (disp === 'inline' || disp === 'contents') { n = n.parentElement; continue; }
      if (disp === 'none' || disp === 'hidden') return;
      var isRow = (disp === 'flex' || disp === 'inline-flex' || disp === 'grid' || disp === 'inline-grid') &&
                  d.flexDirection.indexOf('row') === 0;
      var isCol = (disp === 'flex' || disp === 'inline-flex') && d.flexDirection.indexOf('column') === 0;
      var isBlock = disp === 'block' || disp === 'flow-root' || disp === 'list-item' ||
                    disp === 'inline-block' || disp === 'table' || disp.indexOf('table-row') === 0;
      if (!(isRow || isCol || isBlock)) return;
      if (!rtlSimpleContainer(n) || !rtlCanFlip(n)) break; /* زنجیره اینجا تمام */
      chain.push(n);
      n = n.parentElement;
    }
    if (chain.length) chain[chain.length - 1].setAttribute('dir', 'rtl');
  }

  function translateAttrs(root) {
    var els = root.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title],[data-placeholder]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (shouldSkip(el, SKIP_ATTR)) continue;
      ['placeholder', 'aria-label', 'title', 'data-placeholder'].forEach(function (a) {
        var v = el.getAttribute && el.getAttribute(a);
        if (!v) return;
        var fa;
        /* پیشوندهای دستوری مثل «/goal» باید سرِ جایشان بمانند — فقط توضیح فارسی می‌شود */
        if (/^\/goal\b/i.test(v)) {
          var rest = v.replace(/^\/goal\s*/i, '');
          if (/^describe the objective for a long-running task$/i.test(rest)) {
            fa = '/goal هدفِ کارِ بلندمدت را شرح دهید';
          } else if (/^describe/i.test(rest)) {
            fa = '/goal هدف را شرح دهید…';
          } else {
            fa = null; /* متن ناشناخته — دست نمی‌زنیم */
          }
        } else {
          fa = translateText(v);
        }
        if (fa && fa !== v) el.setAttribute(a, fa);
      });
    }
  }

  /* ---------- ۵) برند ماه‌ای ---------- */
  /* لوگوی پشتیبان — اگر logo.png به هر دلیلی لود نشود، همین SVG داخلی
     (ماه + مغز هوشمند درخشان، آبی ماه‌افزار) نمایش داده می‌شود؛
     یعنی ارمِ شرکت «هرگز» غایب نیست. */
  var LOGO_FALLBACK =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#3282d0"/><stop offset="1" stop-color="#154a8f"/></linearGradient></defs>' +
      '<circle cx="48" cy="48" r="46" fill="url(#g)"/>' +
      '<path d="M62 16a34 34 0 1 0 18 46A28 28 0 0 1 62 16z" fill="#eaf3fc"/>' +
      '<circle cx="40" cy="42" r="13" fill="none" stroke="#3282d0" stroke-width="3"/>' +
      '<path d="M40 29v-6M40 61v6M27 42h-6M59 42h-6M31 33l-4-4M53 55l4 4M49 33l4-4M27 55l-4 4" stroke="#3282d0" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="40" cy="42" r="5" fill="#3282d0"/>' +
      '<circle cx="66" cy="26" r="3" fill="#8fc0f2"/><circle cx="72" cy="38" r="2.4" fill="#8fc0f2"/><circle cx="66" cy="50" r="2" fill="#8fc0f2"/>' +
      '</svg>');

  function guardLogo(img) {
    if (!img || img.__mahaiGuard) return;
    img.__mahaiGuard = true;
    img.addEventListener('error', function () {
      if (img.src !== LOGO_FALLBACK) img.src = LOGO_FALLBACK;
    });
  }

  function injectBrand() {
    /* پنهان کردن ورد‌مارک انگلیسی (whale/deepseek HARNESS) — SVG مسیرمحور است
       و با ترجمهٔ متنی حذف نمی‌شود؛ شناسهٔ یکتای clipPath آن را می‌یابیم. */
    if (!document.getElementById('mahai-wordmark-hidden')) {
      var wm = document.querySelector('svg clipPath[id^="dsh-wordmark"]');
      if (wm) {
        var el = wm.ownerSVGElement, depth = 0;
        while (el && el.parentNode && el.parentNode.nodeName !== 'BODY' && depth < 8) {
          var next = el.parentElement;
          if (next && (next.nodeName === 'ASIDE' || next.nodeName === 'NAV' ||
            (next.getAttribute && next.getAttribute('data-sidebar') !== null))) break;
          el = next; depth++;
        }
        if (el && el.style) { el.style.display = 'none'; }
        var mk = document.createElement('div');
        mk.id = 'mahai-wordmark-hidden';
        mk.style.display = 'none';
        document.body.appendChild(mk);
      }
    }

    /* نشان برند DeepSeek در صفحهٔ آغازین (کلاس ماژولی …brandMark) */
    var bms = document.querySelectorAll('[class*="brandMark"]');
    for (var b = 0; b < bms.length; b++) {
      if (bms[b] && bms[b].style) bms[b].style.display = 'none';
    }
    /* نهنگ متحرک DeepSeek در تیتر صفحهٔ آغازین (کلاس ماژولی …fish) */
    var fish = document.querySelectorAll('[class*="fishHitbox"], svg[class*="fish"]');
    for (var f = 0; f < fish.length; f++) {
      if (fish[f] && fish[f].style) fish[f].style.display = 'none';
    }

    if (document.getElementById('mahai-brandbar')) return true;
    /* نزدیک‌ترین جای پایدار: ابتدای نوار کناری */
    var aside = document.querySelector('aside') || document.querySelector('[data-sidebar]') || document.querySelector('nav');
    if (!aside) return false;
    var bar = document.createElement('div');
    bar.id = 'mahai-brandbar';
    bar.setAttribute('dir', 'rtl');
    bar.innerHTML =
      '<img alt="ارم ماه‌ای — ماه‌افزار هوشمند رسا" />' +
      '<div><span class="mahai-name">ماه‌ای</span>' +
      '<span class="mahai-sub">شرکت ماه‌افزار هوشمند رسا</span>' +
      '<span class="mahai-ver">پوستهٔ فارسی ' + SKIN_VER + '</span></div>';
    var img = bar.querySelector('img');
    img.src = './mahai/logo.png';
    guardLogo(img);
    aside.insertBefore(bar, aside.firstChild);
    return true;
  }

  /* ---------- ۵٫۵) نشان ماه‌ای در قهرمان صفحهٔ آغازین ----------
     جای نهنگ پنهان‌شدهٔ DeepSeek، ارم ماه‌ای می‌نشیند و زیر تیتر،
     نام شرکت می‌آید — تا صفحهٔ خوش‌آمد کاملاً «ماه‌افزار هوشمند رسا» شود.
     نکتهٔ مهم: در dsh تازه (EmptyHero.tsx) تیتر یک <span> داخل
     titleGroup/headline ماژولی است، نه h1/h2 — پس عناصر برگ را هم می‌گردیم. */
  function injectHero() {
    if (document.getElementById('mahai-hero') && document.getElementById('mahai-hero-tag')) return true;
    var els = document.querySelectorAll('h1,h2,span,div');
    var title = null;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length !== 0) continue; /* فقط گره‌های متنی برگ */
      var t = (el.textContent || '').trim();
      if (!t || t.length > 60) continue;
      if (/^(سفر به ناشناخته‌ها|Into the Unknown|探索未至之境)$/.test(t)) { title = el; break; }
    }
    if (!title) return false;
    /* مرز درج: گروه تیتر و ردیف تیتر را با کلاس ماژولی (_titleGroup_…/_headline_…)
       می‌شناسیم تا ارم «بالای کل ردیف تیتر» بنشیند، نه کنارش؛
       در ساختارهای دیگر (h1/h2) همان خودِ عنوان مرز است. */
    var group = (title.parentElement && /titleGroup/i.test(title.parentElement.className || ''))
      ? title.parentElement : title;
    var headline = (group.parentElement && /headline/i.test(group.parentElement.className || ''))
      ? group.parentElement : group;
    var host = headline.parentElement;
    if (!host || host === document.body) {
      host = title.parentElement;
      headline = title;
      if (!host || host === document.body) return false;
    }
    if (!document.getElementById('mahai-hero')) {
      var hero = document.createElement('div');
      hero.id = 'mahai-hero';
      hero.setAttribute('dir', 'rtl');
      hero.innerHTML = '<img alt="ارم ماه‌ای — ماه‌افزار هوشمند رسا" /><div class="mahai-hero-name">ماه‌ای</div>';
      var himg = hero.querySelector('img');
      himg.src = './mahai/logo.png';
      guardLogo(himg);
      /* اگر میزبان چیدمان «ردیفی» (flex-row) داشته باشد، سه‌گانهٔ ارم+تیتر+برچسب
         در یک ستون پیچیده می‌شود تا ارم بالای تیتر بنشیند، نه کنارش */
      var hostStyle = window.getComputedStyle(host);
      if (hostStyle.display.indexOf('flex') !== -1 && hostStyle.flexDirection.indexOf('row') !== -1) {
        var wrap = document.createElement('div');
        wrap.className = 'mahai-hero-wrap';
        var hcs = window.getComputedStyle(headline);
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;min-width:0;' +
          'flex-grow:' + (hcs.flexGrow || '0') + ';flex-shrink:' + (hcs.flexShrink || '1') + ';flex-basis:' + (hcs.flexBasis === 'auto' ? 'auto' : 'auto') + ';';
        host.insertBefore(wrap, headline);
        wrap.appendChild(headline);
        host = wrap;
      }
      host.insertBefore(hero, headline);
    }
    if (!document.getElementById('mahai-hero-tag')) {
      var tag = document.createElement('div');
      tag.id = 'mahai-hero-tag';
      tag.setAttribute('dir', 'rtl');
      tag.textContent = 'محصول شرکت ماه‌افزار هوشمند رسا';
      headline.parentNode.insertBefore(tag, headline.nextSibling);
    }
    return true;
  }

  function applyTitle() {
    if (document.title && document.title.indexOf('ماه‌ای') === -1) document.title = TITLE;
  }

  /* ---------- ۶) ناظر DOM ---------- */
  var pending = null;
  function cycle() {
    applyTitle();
    walk(document.body);
    translateAttrs(document.body);
    injectBrand();
    injectHero();
  }
  function schedule() {
    if (pending) return;
    pending = setTimeout(function () {
      pending = null;
      try {
        /* React گاهی lang را بازنویسی می‌کند — همیشه اعلام دوباره کن.
           dir دست نمی‌خوریم: چیدمان باید همان چیدمان خود اپ بماند. */
        if (html.getAttribute('lang') !== 'fa') html.setAttribute('lang', 'fa');
        if (html.getAttribute('dir') === 'rtl') html.removeAttribute('dir');
        cycle();
      }
      catch (e) { /* خاموش — هرگز رابط را نشکن */ }
    }, 60);
  }

  function start() {
    try {
      cycle();
    } catch (e) { /* خاموش */ }
    new MutationObserver(schedule).observe(document.body, {
      childList: true, subtree: true, characterData: true
    });
    /* گرم‌کن: سایدبار/قهرمان ممکن است با تأخیر سوار شوند — تا ۲۰ ثانیه
       هر ۶۰۰ms اگر برند یا هیرو هنوز نیست، دوباره تلاش کن. */
    var tries = 0;
    var warm = setInterval(function () {
      tries++;
      try {
        if (!document.getElementById('mahai-brandbar') || !document.getElementById('mahai-hero')) cycle();
        if (tries > 33) clearInterval(warm);
      } catch (e) { clearInterval(warm); }
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
