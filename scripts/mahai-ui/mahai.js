/* ============================================================
   ماه‌ای (MahAI) — مترجم زندهٔ رابط وب dsh به فارسی
   محصول شرکت ماه‌افزار هوشمند رسا
   روش کار: یک دیکشنری «متن کامل انگلیسی ← فارسی» روی گره‌های متنی
   DOM اعمال می‌شود (MutationObserver). فقط تطابق «کامل» ترجمه
   می‌شود؛ بنابراین متن پیام‌های خود کاربر هرگز دست‌نخورده می‌ماند.
   برای نمایانی دوباره پس از به‌روزرسانی dsh، پچ index.html را
   دوباره اعمال کنید (در scripts/setup-iran خودکار است).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ۱) راست‌چین و زبان ---------- */
  var html = document.documentElement;
  html.setAttribute('lang', 'fa');
  html.setAttribute('dir', 'rtl');

  var TITLE = 'ماه‌ای — عامل هوشمند سازمانی | ماه‌افزار هوشمند رسا';

  /* ---------- ۲) دیکشنری رابط ---------- */
  var D = {
    /* نوار کناری و ناوبری */
    'New Session': 'گفت‌وگوی جدید',
    'New session': 'گفت‌وگوی جدید',
    'Open sidebar': 'باز کردن نوار کناری',
    'Collapse sidebar': 'جمع کردن نوار کناری',
    'Global panels': 'پنل‌های سراسری',
    'Workspaces': 'فضاهای کاری',
    'Default workspace': 'فضای کاری پیش‌فرض',
    'Add workspace': 'افزودن فضای کاری',
    'Sessions': 'گفت‌وگوها',
    'Chat': 'گفت‌وگو',
    'Plugins': 'افزونه‌ها',
    'Automation tasks': 'کارهای خودکار',
    'Automation task': 'کار خودکار',
    'More': 'بیشتر',
    'Untitled': 'بدون عنوان',
    'Running': 'در حال اجرا',
    'Idle': 'آماده',
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
    'View options': 'گزینه‌های نمایش',
    'Group by': 'گروه‌بندی بر اساس',
    'Order by': 'مرتب‌سازی بر اساس',
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
    'No efforts available for this model.': 'این مدل سطح استدلالی ندارد.',
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
    'Send behavior while busy': 'رفتار ارسال هنگام مشغول بودن',
    'Message delivered': 'پیام تحویل شد',
    'Ask question': 'پرسیدن پرسش',
    'Edit queued message': 'ویرایش پیام صف‌شده',
    'Save queued message': 'ذخیرهٔ پیام صف‌شده',
    'Remove queued message': 'حذف پیام صف‌شده',
    'Steer queued message': 'هدایت پیام صف‌شده',
    'Copied': 'کپی شد',

    /* ابزارها و افزونه‌ها */
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

    /* صفحهٔ بوت (پیش از رندر React) */
    'HARNESS': 'ماه‌ای',
    'DEEPSEEK': 'ماه‌ای',
    'Failed to load plugins': 'خطا در بارگذاری افزونه‌ها',

    /* اعلان پیش‌نمایش */
    'Preview Notice': 'اطلاعیهٔ پیش‌نمایش',
    'Preview': 'پیش‌نمایش',
    'DeepSeek Harness 0.2 is still in preview, and many areas need continued improvement and refinement. We welcome feedback and suggestions from all developers and users. The new desktop app now targets a broad range of users, while developer-related advanced features can be enabled in the settings. DeepSeek Harness’s product features and plugin APIs are expected to continue rapid iteration and evolution, and will gradually stabilize over time.': 'ماه‌ای ۰٫۲ هنوز در مرحلهٔ پیش‌نمایش است و بسیاری از بخش‌ها نیاز به بهبود و پیرایش مستمر دارند. بازخورد و پیشنهادهای همهٔ توسعه‌دهندگان و کاربران را خوشامد می‌گوییم. برنامهٔ رومیزی جدید اکنون طیف گسترده‌ای از کاربران را هدف گرفته و قابلیت‌های مربوط به توسعه‌دهندگان در تنظیمات فعال می‌شود. انتظار می‌رود قابلیت‌های محصول و APIهای افزونه همچنان با شتاب تغییر و بهبود یابند و به‌تدریج پایدار شوند.',
    'We look forward to exploring the limits of intelligence together with users and developers around the world, building on open-source, reusable, and composable infrastructure. We welcome everyone to bring their ideas to life with DeepSeek Harness and participate in the community to enrich the plugin ecosystem.': 'مشتاقانه منتظر کاوش در مرزهای هوش مصنوعی همراه با کاربران و توسعه‌دهندگان سراسر جهان هستیم؛ بر بستر نرم‌افزار آزاد، بازاستفاده‌پذیر و ترکیب‌پذیر. از همه دعوت می‌کنیم ایده‌های خود را با ماه‌ای به واقعیت تبدیل کنند و در جامعهٔ کاربری مشارکت کنند تا اکوسیستم افزونه‌ها غنی‌تر شود.',

    /* صفحهٔ آغازین (Into the Unknown) */
    'Into the Unknown': 'سفر به ناشناخته‌ها',
    'Choose workspace': 'انتخاب فضای کاری',
    'Choose a workspace to start': 'برای شروع، فضای کاری را انتخاب کنید',
    'Standard mode': 'حالت استاندارد',
    'Add files or run commands': 'افزودن فایل یا اجرای دستورات',

    /* متن دیالوگ شروع */
    'Sign in to your DeepSeek account or add an API Key to get started. Your projects and files are stored locally.': 'برای شروع، به حساب DeepSeek خود وارد شوید یا کلید API اضافه کنید. پروژه‌ها و فایل‌های شما به‌صورت محلی ذخیره می‌شوند.',

    /* --- رشته‌های پویا از موتور (صفحهٔ آغازین، ورودی هدف، دکمه‌ها) --- */
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

    /* رشته‌های چینی منوی «+» و گفت‌وگوی جدید */
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

    /* --- پنل ابزارهای فضای کاری و نوار وضعیت --- */
    'Workspace files': 'فایل‌های فضای کاری',
    "Browse files in this session's workspace": 'مرور فایل‌های فضای کاری این گفت‌وگو',
    'Browse files in this session\u2019s workspace': 'مرور فایل‌های فضای کاری این گفت‌وگو',
    'New terminal': 'پایانهٔ جدید',
    'Run commands in the Session workspace': 'اجرای دستورها در فضای کاری گفت‌وگو',
    'More tools': 'ابزارهای بیشتر',
    'commands, @ files or sessions': 'دستورها، @فایل‌ها یا گفت‌وگوها',
    '… commands, @ files or sessions': '… دستورها، @فایل‌ها یا گفت‌وگوها',
    'Completed': 'انجام شد',
    '…tok/s': '…توکن/ث'
  };

  /* ---------- ۳) قواعد الگویی (برای رشته‌های پویا) ---------- */
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
    [/^in (\d+(?:[.,]\d+)?[hms]?)$/u, function (m) { return 'در ' + m[1]; }],
    [/^(\d+(?:[.,]\d+)?)s$/u, function (m) { return m[1] + ' ثانیه'; }],
    [/^(\d+(?:[.,]\d+)?)m$/u, function (m) { return m[1] + ' دقیقه'; }],
    [/^tok\/s$/u, function () { return 'توکن/ث'; }]
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
    for (var i = 0; i < changes.length; i++) changes[i][0].nodeValue = changes[i][1];
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

  /* ---------- ۵) برند ماه‌ای در نوار کناری ---------- */
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

    if (document.getElementById('mahai-brandbar')) return;
    /* نزدیک‌ترین جای پایدار: ابتدای نوار کناری */
    var aside = document.querySelector('aside') || document.querySelector('[data-sidebar]') || document.querySelector('nav');
    if (!aside) return;
    var bar = document.createElement('div');
    bar.id = 'mahai-brandbar';
    bar.setAttribute('dir', 'rtl');
    bar.innerHTML =
      '<img src="./mahai/logo.png" alt="ماه‌ای" />' +
      '<div><span class="mahai-name">ماه‌ای</span>' +
      '<span class="mahai-sub">ماه‌افزار هوشمند رسا</span></div>';
    aside.insertBefore(bar, aside.firstChild);
  }

  /* ---------- ۵٫۵) نشان ماه‌ای در قهرمان صفحهٔ آغازین ----------
     جای نهنگ پنهان‌شدهٔ DeepSeek، ارم ماه‌ای می‌نشیند و زیر تیتر،
     نام شرکت می‌آید — تا صفحهٔ خوش‌آمد کاملاً «ماه‌افزار هوشمند رسا» شود. */
  function injectHero() {
    var cand = document.querySelectorAll('h1,h2');
    for (var i = 0; i < cand.length; i++) {
      var t = (cand[i].textContent || '').trim();
      if (!t || t.length > 60) continue;
      if (!/^(سفر به ناشناخته‌ها|Into the Unknown)$/.test(t)) continue;
      var host = cand[i].parentElement;
      if (!host || host === document.body) return;

      if (!document.getElementById('mahai-hero')) {
        var hero = document.createElement('div');
        hero.id = 'mahai-hero';
        hero.setAttribute('dir', 'rtl');
        hero.innerHTML =
          '<img src="./mahai/logo.png" alt="ارم ماه‌ای" />' +
          '<div class="mahai-hero-name">ماه‌ای</div>';
        host.insertBefore(hero, cand[i]);
      }
      if (!document.getElementById('mahai-hero-tag')) {
        var tag = document.createElement('div');
        tag.id = 'mahai-hero-tag';
        tag.setAttribute('dir', 'rtl');
        tag.textContent = 'محصول شرکت ماه‌افزار هوشمند رسا';
        if (cand[i].nextSibling) host.insertBefore(tag, cand[i].nextSibling);
        else host.appendChild(tag);
      }
      return;
    }
  }

  /* ---------- ۵٫۶) اصلاح نسبت پنل‌ها در حالت راست‌چین ----------
     در RTL گاهی پنل گفت‌وگو له می‌شود و پنل ابزارها/فضای خالی کل صفحه را می‌گیرد.
     این اصلاح‌گر، پنل گفت‌وگو را عریض و پنل ابزارها را باریک (۳۶۰px) می‌کند. */
  function isSidebarish(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el === document.body || el === html) return true;
    var tag = el.nodeName;
    if (tag === 'ASIDE' || tag === 'NAV' || tag === 'HEADER' || tag === 'FOOTER') return true;
    if (el.getAttribute && (el.getAttribute('data-sidebar') !== null || el.getAttribute('role') === 'navigation')) return true;
    if (el.querySelector && (el.querySelector('[data-sidebar]') || el.querySelector('#mahai-brandbar'))) return true;
    var cl = (el.getAttribute && el.getAttribute('class')) || '';
    if (/sidebar|side-bar|navigation/i.test(cl)) return true;
    return false;
  }
  function fixChatLayout() {
    var composer = document.querySelector('textarea, [contenteditable="true"]');
    if (!composer) return;

    var row = null, chatPane = null, toolsPane = null;

    /* راهبرد ۱ — پنل ابزارها از روی متن دکمه‌هایش پیدا می‌شود (دقیق‌ترین) */
    var cand = document.querySelectorAll('button, div[role="button"], a');
    var toolBtn = null;
    for (var i = 0; i < cand.length; i++) {
      var tx = cand[i].textContent || '';
      if (/Workspace files|فایل‌های فضای کاری/.test(tx)) { toolBtn = cand[i]; break; }
    }
    if (toolBtn) {
      var a = composer, b = toolBtn;
      while (a && a !== document.body && !a.contains(b)) a = a.parentElement;
      if (a && a !== document.body) {
        row = a;
        while (row && row.children.length === 1 && row.firstElementChild) row = row.firstElementChild;
      }
      if (row && row !== document.body) {
        chatPane = null; toolsPane = null;
        var kids = row.children;
        for (var k = 0; k < kids.length; k++) {
          if (kids[k].contains(composer)) chatPane = kids[k];
          else if (kids[k].contains(toolBtn)) toolsPane = kids[k];
        }
      }
    }

    /* راهبرد ۲ — از سمت ورودی پیام به بالاترین جدِ مفید (پشتیبان) */
    if (!chatPane || !toolsPane) {
      var pane = composer, parent = pane.parentElement, found = null;
      while (parent && parent !== document.body) {
        var wide = 0, other = null;
        for (var j = 0; j < parent.children.length; j++) {
          var c = parent.children[j];
          if (c === pane || isSidebarish(c)) continue;
          var r = c.getBoundingClientRect();
          if (r.width > 200 && r.height > 200) { wide++; other = other || c; }
        }
        if (wide >= 1 && other) { found = parent; break; }
        pane = parent; parent = pane.parentElement;
      }
      if (found) {
        row = found; chatPane = pane; toolsPane = other;
      }
    }

    if (!row || !chatPane || !toolsPane || row === document.body) return;
    var rr = row.getBoundingClientRect();
    var cr = chatPane.getBoundingClientRect();
    if (rr.width < 300 || cr.width > rr.width * 0.5) return; /* گفت‌وگو از قبل عریض است */

    chatPane.style.flex = '1 1 auto';
    chatPane.style.width = 'auto';
    chatPane.style.minWidth = '0';
    chatPane.style.maxWidth = 'none';
    toolsPane.style.flex = '0 0 auto';
    toolsPane.style.width = 'min(360px, 32vw)';
    toolsPane.style.minWidth = '0';
    toolsPane.style.overflow = 'hidden auto';
  }

  function applyTitle() {
    if (document.title && document.title.indexOf('ماه‌ای') === -1) document.title = TITLE;
  }

  /* ---------- ۶) ناظر DOM ---------- */
  var pending = null;
  function schedule() {
    if (pending) return;
    pending = setTimeout(function () {
      pending = null;
      try {
        /* React گاهی lang/dir را بازنویسی می‌کند — همیشه اعلام دوباره کن */
        if (html.getAttribute('lang') !== 'fa') html.setAttribute('lang', 'fa');
        if (html.getAttribute('dir') !== 'rtl') html.setAttribute('dir', 'rtl');
        applyTitle(); walk(document.body); translateAttrs(document.body); injectBrand(); injectHero(); fixChatLayout();
      }
      catch (e) { /* خاموش — هرگز رابط را نشکن */ }
    }, 60);
  }

  function start() {
    applyTitle();
    walk(document.body);
    translateAttrs(document.body);
    injectBrand();
    injectHero();
    fixChatLayout();
    new MutationObserver(schedule).observe(document.body, {
      childList: true, subtree: true, characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
