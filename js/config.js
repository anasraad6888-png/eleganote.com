/**
 * Site configuration — edit store URLs and Firebase Web App ID before production deploy.
 * Firebase Console → Project settings → Your apps → Web app → appId
 */
window.ELEGANOTE_SITE = {
  subscriptionApiUrl: 'https://eleganote-subscription.onrender.com',

  firebase: {
    apiKey: 'AIzaSyAnuOJl7PA8g55e7Mc2xM3kKq6j93-7SGs',
    authDomain: 'eleganote-dbd15.firebaseapp.com',
    projectId: 'eleganote-dbd15',
    storageBucket: 'eleganote-dbd15.firebasestorage.app',
    messagingSenderId: '977419077301',
    // Firebase Console → Project settings → Your apps → Web → copy appId (required for sign-in on eleganote.com):
    appId: '1:977419077301:web:0000000000000000000000',
  },

  /** Google Sign-In Web client (OAuth 2.0, type Web) from Firebase / Google Cloud */
  googleWebClientId:
    '977419077301-kpa1bc76hc0oid6h0tce9cl5t93f9loo.apps.googleusercontent.com',

  stores: {
    play:
      'https://play.google.com/store/apps/details?id=com.anasraad.eleganote',
    appStore: '', // e.g. https://apps.apple.com/app/idXXXXXXXX
    desktop: '', // optional direct download / GitHub releases URL
  },

  contactEmail: 'anasraad6888@gmail.com',

  plans: [
    {
      id: 'eleganote_premium_monthly',
      planKey: 'monthly',
      priceUsd: 4.99,
      durationDays: 30,
      titleEn: 'Monthly',
      titleAr: 'شهري',
      badge: null,
    },
    {
      id: 'eleganote_premium_quarterly',
      planKey: 'quarterly',
      priceUsd: 9.99,
      durationDays: 90,
      titleEn: '3 months',
      titleAr: '3 أشهر',
      badge: 'Popular',
    },
    {
      id: 'eleganote_premium_yearly',
      planKey: 'yearly',
      priceUsd: 29.99,
      durationDays: 365,
      titleEn: 'Yearly',
      titleAr: 'سنوي',
      badge: 'Best value',
    },
  ],

  premiumFeatures: [
    {
      icon: '∞',
      titleEn: 'Unlimited documents',
      titleAr: 'مستندات غير محدودة',
      descEn: 'Free plan allows up to 10 documents.',
      descAr: 'الخطة المجانية تسمح بـ 10 مستندات كحد أقصى.',
    },
    {
      icon: '📄',
      titleEn: 'Unlimited pages',
      titleAr: 'صفحات غير محدودة',
      descEn: 'No 20-page cap per document.',
      descAr: 'بدون حد 20 صفحة لكل مستند.',
    },
    {
      icon: '📤',
      titleEn: 'Export & backup',
      titleAr: 'تصدير ونسخ احتياطي',
      descEn: 'PDF export, cloud backup to Drive/Dropbox, restore archives.',
      descAr: 'تصدير PDF، نسخ سحابي إلى Drive/Dropbox، واستعادة الأرشيف.',
    },
    {
      icon: '🎨',
      titleEn: 'Premium themes',
      titleAr: 'سمات Premium',
      descEn: 'Extra color themes and styling options.',
      descAr: 'سمات وألوان إضافية للواجهة.',
    },
    {
      icon: '📁',
      titleEn: 'Batch import',
      titleAr: 'استيراد متعدد',
      descEn: 'Import several files at once.',
      descAr: 'استيراد عدة ملفات دفعة واحدة.',
    },
  ],

  appFeatures: [
    {
      icon: '✍️',
      titleEn: 'Handwriting & drawing',
      titleAr: 'كتابة يدوية ورسم',
      descEn:
        'Smooth ink, shapes, connectors, lasso selection, and a flexible infinite canvas.',
      descAr: 'حبر سلس، أشكال، موصلات، تحديد حر، ولوحة مرنة.',
      tag: 'Canvas',
    },
    {
      icon: '📝',
      titleEn: 'Rich documents',
      titleAr: 'مستندات غنية',
      descEn:
        'Text boxes, tables, images, stickers, folders, tags, and multi-page notebooks.',
      descAr: 'مربعات نص، جداول، صور، ملصقات، مجلدات، ووسوم.',
      tag: 'Editor',
    },
    {
      icon: '📑',
      titleEn: 'PDF import & search',
      titleAr: 'استيراد PDF وبحث',
      descEn: 'Import PDFs as pages and search text across the document.',
      descAr: 'استيراد PDF كصفحات والبحث في النص.',
      tag: 'PDF',
    },
    {
      icon: '🎙️',
      titleEn: 'Audio notes',
      titleAr: 'ملاحظات صوتية',
      descEn: 'Record voice memos linked to your notes — stored locally.',
      descAr: 'تسجيل صوتي مرتبط بملاحظاتك — محلياً على جهازك.',
      tag: 'Audio',
    },
    {
      icon: '📐',
      titleEn: 'Rulers & precision',
      titleAr: 'مساطر ودقة',
      descEn: 'Rulers, snapping, and dimension guides for technical sketches.',
      descAr: 'مساطر، محاذاة، وأدلة أبعاد للرسومات الدقيقة.',
      tag: 'Tools',
    },
    {
      icon: '🔒',
      titleEn: 'Local-first privacy',
      titleAr: 'خصوصية محلية',
      descEn: 'No ads or tracking SDKs. Your notes stay on your device by default.',
      descAr: 'بدون إعلانات أو تتبع. بياناتك على جهازك افتراضياً.',
      tag: 'Privacy',
    },
    {
      icon: '☁️',
      titleEn: 'Optional cloud backup',
      titleAr: 'نسخ احتياطي اختياري',
      descEn: 'Encrypted ZIP backups to Google Drive or Dropbox (Premium).',
      descAr: 'نسخ ZIP مشفّرة إلى Google Drive أو Dropbox (Premium).',
      tag: 'Cloud',
    },
    {
      icon: '🖥️',
      titleEn: 'Cross-platform',
      titleAr: 'منصات متعددة',
      descEn: 'iOS, Android, macOS, Windows, and Linux.',
      descAr: 'iOS و Android و macOS و Windows و Linux.',
      tag: 'Platforms',
    },
  ],
};
