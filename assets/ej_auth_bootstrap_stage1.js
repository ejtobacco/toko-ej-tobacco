import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDB-fmTDiy6aNF4hxbkv1natMAEHgvvOv8',
  authDomain: 'ej-tobacco-store.firebaseapp.com',
  databaseURL: 'https://ej-tobacco-store-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ej-tobacco-store',
  storageBucket: 'ej-tobacco-store.firebasestorage.app',
  messagingSenderId: '70458372662',
  appId: '1:70458372662:web:c37950efaf04b33c7f9e97',
  measurementId: 'G-VCRFQSRB9H'
};

const SESSION_KEY = 'ej_role_session_v1';
const LOGIN_TIME_KEY = 'ej_role_login_time_label';
const config = window.EJ_AUTH_BOOTSTRAP_CONFIG || {};
const loginUrl = config.loginUrl || '../portal/';
const allowedRoles = Array.isArray(config.allowedRoles) ? config.allowedRoles : ['kurir', 'admin_pusat'];

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

function clearStage1Session() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);
  localStorage.removeItem('ej_active_courier_id');
  localStorage.removeItem('ej_active_courier_name');
}

function makeLoginTimeLabel() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

function persistStage1Mirror(user, tokenResult) {
  const claims = tokenResult?.claims || {};
  const email = String(user.email || '').trim().toLowerCase();
  const username = email.includes('@') ? email.split('@')[0] : email;
  const role = String(claims.role || '').trim();
  const courierId = String(claims.courier_id || '').trim();

  const session = {
    uid: user.uid,
    id: courierId || user.uid,
    courier_id: courierId,
    email,
    username,
    role,
    name: String(claims.name || user.displayName || username || email || 'User'),
    source: 'firebase_auth_stage1',
    savedAt: Date.now()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (!localStorage.getItem(LOGIN_TIME_KEY)) {
    localStorage.setItem(LOGIN_TIME_KEY, makeLoginTimeLabel());
  }
  return session;
}

function redirectToLogin() {
  window.location.href = loginUrl;
}

window.EJ_AUTH_READY = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        clearStage1Session();
        reject(new Error('AUTH_REQUIRED'));
        redirectToLogin();
        return;
      }

      const tokenResult = await user.getIdTokenResult(true);
      const role = String(tokenResult?.claims?.role || '').trim();
      if (!allowedRoles.includes(role)) {
        clearStage1Session();
        await signOut(auth).catch(() => {});
        reject(new Error('ROLE_NOT_ALLOWED'));
        redirectToLogin();
        return;
      }

      const session = persistStage1Mirror(user, tokenResult);
      window.__EJ_AUTH_CONTEXT = { app, auth, user, tokenResult, session };
      document.documentElement.style.visibility = 'visible';
      resolve(window.__EJ_AUTH_CONTEXT);
    } catch (err) {
      console.error('EJ_AUTH_BOOTSTRAP_FAILED', err);
      clearStage1Session();
      reject(err);
      redirectToLogin();
    }
  });
});

window.EJ_AUTH_UTILS = { app, auth, clearStage1Session };
