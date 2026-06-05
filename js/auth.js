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
    return auth.signInWithPopup(provider);
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
