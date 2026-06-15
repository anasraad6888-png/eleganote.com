/**
 * Launch waitlist — standalone so it works even if app.js fails later.
 */
(function () {
  function openWaitlist() {
    const toggle = document.getElementById('waitlistToggle');
    const embed = document.getElementById('waitlistEmbed');
    const iframe = embed?.querySelector('iframe');
    if (!embed) return;

    embed.classList.add('is-open');
    embed.hidden = false;

    if (toggle) {
      toggle.hidden = true;
      toggle.setAttribute('aria-expanded', 'true');
    }

    if (iframe) {
      const src = iframe.getAttribute('data-src');
      if (src && !iframe.getAttribute('src')) {
        iframe.setAttribute('src', src);
      }
    }

    requestAnimationFrame(() => {
      embed.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function init() {
    const toggle = document.getElementById('waitlistToggle');
    if (!toggle) return;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'waitlistEmbed');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlist();
    });
  }

  window.EleganoteWaitlist = { open: openWaitlist };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
