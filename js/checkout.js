/**
 * Premium subscription status & checkout via Eleganote Subscription API.
 */
(function () {
  const cfg = window.ELEGANOTE_SITE;

  async function apiFetch(path, options = {}) {
    const base = cfg.subscriptionApiUrl.replace(/\/$/, '');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    const res = await fetch(`${base}${path}`, { ...options, headers });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(body.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  async function fetchStatus() {
    const token = await window.EleganoteAuth?.idToken?.();
    if (!token) return null;
    return apiFetch('/v1/subscription/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function startCheckout(planId, provider) {
    const token = await window.EleganoteAuth.idToken();
    if (!token) throw new Error('Sign in required');

    const user = window.EleganoteAuth.user;
    const body = await apiFetch('/v1/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        planId,
        provider,
        email: user?.email || undefined,
      }),
    });
    return body.checkoutUrl;
  }

  function planByKey(key) {
    return cfg.plans.find((p) => p.planKey === key) || cfg.plans[2];
  }

  window.EleganoteCheckout = {
    fetchStatus,
    startCheckout,
    planByKey,
    supportsCrypto(plan) {
      return plan.planKey === 'yearly' && plan.priceUsd >= 10;
    },
  };
})();
