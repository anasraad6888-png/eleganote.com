/**
 * Firebase Authentication for the marketing site.
 */
(function () {
  const cfg = window.ELEGANOTE_SITE;
  if (!cfg?.firebase?.apiKey) {
    console.warn('Eleganote site: Firebase config missing');
    return;
  }

  const app = firebase.initializeApp(cfg.firebase);
  const auth = firebase.auth();

  const BUILTIN_AUTH_HOSTS = new Set([
    'localhost',
    'eleganote-dbd15.firebaseapp.com',
    'eleganote-dbd15.web.app',
  ]);

  function currentAuthHost() {
    return window.location.hostname;
  }

  function isLikelyAuthorizedHost() {
    const host = currentAuthHost();
    if (BUILTIN_AUTH_HOSTS.has(host)) return true;
    const extra = cfg.firebaseAuthorizedDomains || [];
    return extra.includes(host);
  }

  if (!isLikelyAuthorizedHost()) {
    console.warn(
      `[Eleganote] OAuth host "${currentAuthHost()}" is not in firebaseAuthorizedDomains. ` +
        'Add it in Firebase Console → Authentication → Settings → Authorized domains.',
    );
  }

  if (cfg.googleWebClientId) {
    auth.useDeviceLanguage();
  }

  let currentUser = null;
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => {
      try {
        fn(currentUser);
      } catch (e) {
        console.error(e);
      }
    });
  }

  auth.onAuthStateChanged((user) => {
    currentUser = user;
    notify();
  });

  async function idToken() {
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }

  async function signInEmail(email, password) {
    return auth.signInWithEmailAndPassword(email.trim(), password);
  }

  async function signUpEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email.trim(), password);
  }

  async function resetPassword(email) {
    return auth.sendPasswordResetEmail(email.trim());
  }

  async function signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    if (cfg.googleWebClientId) {
      provider.setCustomParameters({ prompt: 'select_account' });
    }
    try {
      return await auth.signInWithPopup(provider);
    } catch (err) {
      if (err?.code === 'auth/unauthorized-domain') {
        const host = currentAuthHost();
        const hint =
          `Add "${host}" in Firebase Console → Authentication → Settings → Authorized domains ` +
          `(project: ${cfg.firebase?.projectId || 'eleganote-dbd15'}). ` +
          'Also add https://' +
          host +
          ' under Google Cloud → APIs & Credentials → OAuth Web client → Authorized JavaScript origins.';
        throw Object.assign(new Error(hint), { code: err.code });
      }
      throw err;
    }
  }

  async function signOut() {
    return auth.signOut();
  }

  function onAuthChanged(fn) {
    listeners.add(fn);
    fn(currentUser);
    return () => listeners.delete(fn);
  }

  window.EleganoteAuth = {
    currentAuthHost,
    isLikelyAuthorizedHost,
    get user() {
      return currentUser;
    },
    onAuthChanged,
    idToken,
    signInEmail,
    signUpEmail,
    resetPassword,
    signInGoogle,
    signOut,
  };
})();
