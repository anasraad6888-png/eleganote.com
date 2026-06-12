(function () {
  const cfg = window.ELEGANOTE_SITE;
  let lang = localStorage.getItem('eleganote_site_lang') || 'en';
  let selectedPlanKey = 'yearly';
  let subscription = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function t(en, ar) {
    return lang === 'ar' ? ar : en;
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem('eleganote_site_lang', lang);
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');
    $('#langToggle').textContent = lang === 'ar' ? 'EN' : 'عربي';
    renderI18n();
    renderPlans();
    renderFeatures();
    renderPremiumPerks();
    renderStores();
  }

  function renderI18n() {
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const en = el.getAttribute('data-i18n-en');
      const ar = el.getAttribute('data-i18n-ar');
      if (en && ar) el.textContent = t(en, ar);
    });
  }

  function renderFeatures() {
    const grid = $('#featureGallery');
    if (!grid) return;
    grid.innerHTML = cfg.appFeatures
      .map(
        (f) => `
      <article class="feature-card">
        <span class="feature-tag">${f.tag}</span>
        <div class="feature-icon">${f.icon}</div>
        <h3>${t(f.titleEn, f.titleAr)}</h3>
        <p>${t(f.descEn, f.descAr)}</p>
      </article>`,
      )
      .join('');
  }

  function renderPremiumPerks() {
    const grid = $('#premiumPerks');
    if (!grid) return;
    grid.innerHTML = cfg.premiumFeatures
      .map(
        (f) => `
      <div class="perk">
        <strong>${f.icon} ${t(f.titleEn, f.titleAr)}</strong>
        <span>${t(f.descEn, f.descAr)}</span>
      </div>`,
      )
      .join('');
  }

  function renderPlans() {
    const grid = $('#pricingGrid');
    if (!grid) return;
    const single = cfg.plans.length === 1;
    $('#premiumCheckoutCard')?.classList.toggle('premium-checkout-card--single', single);
    if (single) selectedPlanKey = cfg.plans[0].planKey;

    grid.innerHTML = cfg.plans
      .map((plan) => {
        const selected = single || plan.planKey === selectedPlanKey;
        const badge = plan.badge
          ? `<span class="plan-badge">${plan.badge}</span>`
          : '';
        return `
        <div class="plan-card ${selected ? 'selected' : ''}" data-plan="${plan.planKey}"${single ? '' : ' role="button" tabindex="0"'}>
          ${badge}
          <div class="plan-duration">${t(plan.titleEn, plan.titleAr)}</div>
          <div class="plan-price">$${plan.priceUsd.toFixed(2)}</div>
          <div class="plan-duration">${plan.durationDays} ${t('days', 'يوم')}</div>
        </div>`;
      })
      .join('');

    if (!single) {
      grid.querySelectorAll('.plan-card').forEach((card) => {
        const select = () => {
          selectedPlanKey = card.dataset.plan;
          renderPlans();
          updateCheckoutUi();
        };
        card.addEventListener('click', select);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select();
          }
        });
      });
    }
    updateCheckoutUi();
  }

  function renderStores() {
    const play = cfg.stores.play;
    const appStore = cfg.stores.appStore;
    const desktop = cfg.stores.desktop;

    const playRow = $('#storePlay');
    const iosRow = $('#storeIos');
    const deskRow = $('#storeDesktop');

    if (play && playRow) {
      playRow.href = play;
      playRow.classList.remove('hidden');
      $('#badgePlay')?.classList.add('hidden');
    }
    if (appStore && iosRow) {
      iosRow.href = appStore;
      iosRow.classList.remove('hidden');
      $('#badgeIos')?.classList.add('hidden');
    }
    if (desktop && deskRow) {
      deskRow.href = desktop;
      deskRow.classList.remove('hidden');
      $('#badgeDesktop')?.classList.add('hidden');
    }
  }

  function showAlert(el, message, kind) {
    if (!el) return;
    el.textContent = message;
    el.className = `alert alert-${kind}`;
    el.classList.remove('hidden');
  }

  function hideAlert(el) {
    el?.classList.add('hidden');
  }

  function updateAuthUi(user) {
    const signedOut = $('#authSignedOut');
    const signedIn = $('#authSignedIn');
    const checkoutSignedOut = $('#checkoutSignInHint');

    if (user) {
      signedOut?.classList.add('hidden');
      signedIn?.classList.remove('hidden');
      checkoutSignedOut?.classList.add('hidden');
      const name = user.displayName || user.email || 'User';
      $('#userName').textContent = name;
      $('#userEmail').textContent = user.email || '';
      $('#userAvatar').textContent = (name[0] || '?').toUpperCase();
      refreshSubscription();
    } else {
      signedOut?.classList.remove('hidden');
      signedIn?.classList.add('hidden');
      checkoutSignedOut?.classList.remove('hidden');
      subscription = null;
      updateCheckoutUi();
    }
  }

  function updateCheckoutUi() {
    const plan = window.EleganoteCheckout?.planByKey(selectedPlanKey);
    const statusEl = $('#subStatus');
    const payCard = $('#payCardBtn');

    if (!plan || !statusEl) return;

    const isPremium =
      subscription?.state === 'active' &&
      subscription?.expiresAt &&
      new Date(subscription.expiresAt) > new Date();

    if (isPremium) {
      statusEl.className = 'status-pill premium-active';
      const until = subscription.expiresAt
        ? new Date(subscription.expiresAt).toLocaleDateString(
            lang === 'ar' ? 'ar' : 'en',
          )
        : '';
      statusEl.textContent = until
        ? t(`Premium active until ${until}`, `Premium نشط حتى ${until}`)
        : t('Premium active', 'Premium نشط');
      payCard.disabled = true;
      return;
    }

    statusEl.className = 'status-pill';
    statusEl.textContent = t('Subscribe to unlock Premium', 'اشترك لتفعيل Premium');
    payCard.disabled = !window.EleganoteAuth?.user;
  }

  async function refreshSubscription() {
    try {
      subscription = await window.EleganoteCheckout.fetchStatus();
    } catch (e) {
      console.warn('subscription status', e);
      subscription = null;
    }
    updateCheckoutUi();
  }

  async function handleCheckout(provider) {
    const errEl = $('#checkoutError');
    hideAlert(errEl);
    const plan = window.EleganoteCheckout.planByKey(selectedPlanKey);
    if (!window.EleganoteAuth?.user) {
      showAlert(
        errEl,
        t('Sign in to subscribe.', 'سجّل الدخول للاشتراك.'),
        'warn',
      );
      document.querySelector('#account')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const btn = $('#payCardBtn');
    btn.disabled = true;
    try {
      const url = await window.EleganoteCheckout.startCheckout(plan.id, provider);
      if (url) window.location.href = url;
      else throw new Error('No checkout URL');
    } catch (e) {
      showAlert(
        errEl,
        e.message ||
          t('Checkout failed. Try again from the app.', 'فشل الدفع. جرّب من التطبيق.'),
        'error',
      );
    } finally {
      btn.disabled = false;
      updateCheckoutUi();
    }
  }

  function setupAuthForms() {
    const tabs = $$('.auth-tab');
    let mode = 'signin';

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.mode;
        tabs.forEach((t) => t.classList.toggle('active', t.dataset.mode === mode));
        $('#authFormTitle').textContent =
          mode === 'signup'
            ? t('Create account', 'إنشاء حساب')
            : t('Sign in', 'تسجيل الدخول');
        $('#authSubmitBtn').textContent =
          mode === 'signup' ? t('Sign up', 'تسجيل') : t('Sign in', 'دخول');
        $('#resetPanel')?.classList.toggle('hidden', mode !== 'signin');
      });
    });

    $('#authForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = $('#authError');
      hideAlert(errEl);
      const email = $('#authEmail').value;
      const password = $('#authPassword').value;
      try {
        if (mode === 'signup') {
          await window.EleganoteAuth.signUpEmail(email, password);
        } else {
          await window.EleganoteAuth.signInEmail(email, password);
        }
        hideAlert(errEl);
      } catch (err) {
        showAlert(errEl, mapAuthError(err), 'error');
      }
    });

    $('#resetBtn')?.addEventListener('click', async () => {
      const errEl = $('#authError');
      const email = $('#authEmail').value;
      if (!email) {
        showAlert(errEl, t('Enter your email first.', 'أدخل بريدك أولاً.'), 'warn');
        return;
      }
      try {
        await window.EleganoteAuth.resetPassword(email);
        showAlert(
          errEl,
          t('Password reset email sent.', 'تم إرسال رابط إعادة تعيين كلمة المرور.'),
          'info',
        );
      } catch (err) {
        showAlert(errEl, mapAuthError(err), 'error');
      }
    });

    $('#googleBtn')?.addEventListener('click', async () => {
      const errEl = $('#authError');
      hideAlert(errEl);
      try {
        await window.EleganoteAuth.signInGoogle();
      } catch (err) {
        showAlert(errEl, mapAuthError(err), 'error');
      }
    });

    $('#signOutBtn')?.addEventListener('click', () => window.EleganoteAuth.signOut());
  }

  function mapAuthError(err) {
    const code = err?.code || '';
    const map = {
      'auth/invalid-email': [t('Invalid email.', 'بريد غير صالح.')],
      'auth/user-not-found': [t('No account for this email.', 'لا يوجد حساب بهذا البريد.')],
      'auth/wrong-password': [t('Wrong password.', 'كلمة مرور خاطئة.')],
      'auth/email-already-in-use': [
        t('Email already registered.', 'البريد مسجّل مسبقاً.'),
      ],
      'auth/weak-password': [t('Password too weak (6+ chars).', 'كلمة مرور ضعيفة (6+ أحرف).')],
      'auth/popup-closed-by-user': [t('Sign-in cancelled.', 'تم إلغاء تسجيل الدخول.')],
      'auth/unauthorized-domain': [
        t(
          `This domain (${window.location.hostname}) is not authorized for Google sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains, then add https://${window.location.hostname} in Google Cloud OAuth “Authorized JavaScript origins”.`,
          `هذا النطاق (${window.location.hostname}) غير مصرّح به. أضفه في Firebase Console → Authentication → Settings → Authorized domains، ثم أضف https://${window.location.hostname} في Google Cloud ضمن Authorized JavaScript origins.`,
        ),
      ],
    };
    return (map[code] && map[code][0]) || err?.message || t('Authentication failed.', 'فشل المصادقة.');
  }

  function init() {
    setLang(lang);
    $('#langToggle')?.addEventListener('click', () =>
      setLang(lang === 'ar' ? 'en' : 'ar'),
    );
    renderPlans();
    renderFeatures();
    renderPremiumPerks();
    renderStores();
    setupAuthForms();

    $('#payCardBtn')?.addEventListener('click', () => handleCheckout('gammaltech'));
    $('#refreshSubBtn')?.addEventListener('click', refreshSubscription);

    if (window.EleganoteAuth) {
      window.EleganoteAuth.onAuthChanged(updateAuthUi);
    } else {
      showAlert(
        $('#authError'),
        t(
          'Firebase not loaded. Check config.js and authorized domains.',
          'Firebase غير محمّل. تحقق من config.js والنطاقات المصرّحة.',
        ),
        'warn',
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();