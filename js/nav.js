/**
 * Mobile navigation — standalone so it works even if app.js fails later.
 */
(function () {
  function initNav() {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('navMenuToggle');
    const panel = document.getElementById('navMenuPanel');
    const backdrop = document.getElementById('navBackdrop');
    if (!nav || !toggle || !panel) return;

    const syncNavHeight = () => {
      const h = nav.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--site-nav-h', `${h}px`);
    };

    const label = (open) => {
      const ar = document.documentElement.lang === 'ar';
      return open
        ? ar
          ? 'إغلاق القائمة'
          : 'Close menu'
        : ar
          ? 'فتح القائمة'
          : 'Open menu';
    };

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', label(open));
      panel.hidden = !open;
      if (backdrop) backdrop.hidden = !open;
      document.body.classList.toggle('nav-menu-open', open);
      if (open) syncNavHeight();
    };

    const close = () => setOpen(false);

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    backdrop?.addEventListener('click', close);

    panel.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
      syncNavHeight();
      if (window.innerWidth > 860) close();
    });

    syncNavHeight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();