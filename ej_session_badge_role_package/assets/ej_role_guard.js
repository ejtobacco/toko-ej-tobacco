const SESSION_KEY = 'ej_role_session_v1';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDB-fmTDiy6aNF4hxbkv1natMAEHgvvOv8",
  authDomain: "ej-tobacco-store.firebaseapp.com",
  databaseURL: "https://ej-tobacco-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ej-tobacco-store",
  storageBucket: "ej-tobacco-store.firebasestorage.app",
  messagingSenderId: "70458372662",
  appId: "1:70458372662:web:c37950efaf04b33c7f9e97",
  measurementId: "G-VCRFQSRB9H"
};

function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    return null;
  }
}

function loadSession() {
  return safeParse(localStorage.getItem(SESSION_KEY) || 'null');
}

function showPage() {
  document.documentElement.style.visibility = 'visible';
}

function getConfig() {
  const fromWindow = window.EJ_ROLE_GUARD || {};
  const metaRoles = document.querySelector('meta[name="ej-allowed-roles"]')?.content || '';
  const roles = Array.isArray(fromWindow.allowedRoles)
    ? fromWindow.allowedRoles
    : metaRoles.split(',').map(v => v.trim()).filter(Boolean);

  return {
    allowedRoles: roles,
    loginUrl: fromWindow.loginUrl || '../portal/',
    fallbackHome: fromWindow.fallbackHome || './',
    allowAdminPusatBypass: fromWindow.allowAdminPusatBypass !== false,
    syncPosSettings: !!fromWindow.syncPosSettings
  };
}

function roleTarget(role, session, fallbackHome) {
  if (session?.target) return session.target;
  if (role === 'admin_pusat') return fallbackHome || './';
  if (role === 'admin_cabang') return '../pos-cabang/';
  if (role === 'kurir') return '../kurir/';
  if (role === 'customer') return '../customer/';
  return fallbackHome || './';
}

function renderBlocked(reason, session, config) {
  const role = session?.role || 'guest';
  const backUrl = roleTarget(role, session, config.fallbackHome);

  document.body.innerHTML = `
    <style>
      body{
        min-height:100vh;margin:0;display:flex;align-items:center;justify-content:center;padding:18px;
        font-family:Inter,Arial,sans-serif;background:
        radial-gradient(circle at top left, rgba(59,130,246,.12), transparent 24%),
        radial-gradient(circle at top right, rgba(212,175,55,.10), transparent 28%),
        #07090d;color:#f5f7fb
      }
      .guard-box{
        width:100%;max-width:430px;padding:22px;border-radius:28px;
        background:linear-gradient(180deg, rgba(17,22,32,.92), rgba(12,16,24,.86));
        border:1px solid rgba(255,255,255,.08);box-shadow:0 20px 60px rgba(0,0,0,.38)
      }
      .guard-badge{
        display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:7px 12px;border-radius:999px;
        background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);font-size:11px;font-weight:800;color:#f6dd82
      }
      .guard-title{margin-top:16px;font-size:28px;font-weight:800;line-height:1.15}
      .guard-sub{margin-top:10px;color:#98a2b3;font-size:13px;line-height:1.65}
      .guard-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
      .guard-stat{
        background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:14px
      }
      .guard-stat label{display:block;color:#98a2b3;font-size:11px;margin-bottom:8px;font-weight:600}
      .guard-stat strong{display:block;font-size:16px;font-weight:800}
      .guard-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
      .guard-btn,.guard-ghost{
        min-height:48px;border-radius:16px;border:none;font-size:13px;font-weight:800;display:inline-flex;
        align-items:center;justify-content:center;text-decoration:none
      }
      .guard-btn{background:linear-gradient(135deg,#f7e08c 0%,#d4af37 55%,#b8860b 100%);color:#151515}
      .guard-ghost{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#f5f7fb}
      .guard-note{margin-top:12px;font-size:11px;color:#98a2b3;line-height:1.6}
      @media (max-width:390px){.guard-grid,.guard-actions{grid-template-columns:1fr}}
    </style>
    <div class="guard-box">
      <div class="guard-badge">ROLE PROTECTION AKTIF</div>
      <div class="guard-title">Akses ditolak</div>
      <div class="guard-sub">${reason}</div>
      <div class="guard-grid">
        <div class="guard-stat">
          <label>Role saat ini</label>
          <strong>${session?.role || 'guest'}</strong>
        </div>
        <div class="guard-stat">
          <label>User</label>
          <strong>${session?.name || session?.username || 'Belum login'}</strong>
        </div>
      </div>
      <div class="guard-actions">
        <a class="guard-btn" href="${config.loginUrl}">Ke portal login</a>
        <a class="guard-ghost" href="${backUrl}">Halaman role saya</a>
      </div>
      <div class="guard-note">
        Proteksi ini mencegah role yang salah membuka halaman yang tidak sesuai, misalnya admin cabang ke dashboard pusat atau customer ke panel admin.
      </div>
    </div>
  `;
  showPage();
}

async function verifyUser(session) {
  const [{ initializeApp }, { getDatabase, ref, get }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js')
  ]);

  const app = initializeApp(FIREBASE_CONFIG, `role-guard-${Date.now()}`);
  const db = getDatabase(app);
  const snap = await get(ref(db, `app_users/${session.id}`));
  return snap.val();
}

function syncPosSessionIfNeeded(session) {
  const cashier = session?.name || 'Admin Cabang';
  const branchCode = session?.branchCode || 'CBG-BRB-BARAT';
  localStorage.setItem('ej_pos_cabang_live_settings_v1', JSON.stringify({
    branchCode,
    cashier
  }));
}

async function bootGuard() {
  const config = getConfig();
  const session = loadSession();

  if (!config.allowedRoles.length) {
    console.warn('EJ_ROLE_GUARD: allowedRoles belum diisi.');
    showPage();
    return;
  }

  if (!session) {
    renderBlocked('Anda belum login. Silakan masuk lewat portal role dulu.', null, config);
    return;
  }

  if (config.syncPosSettings && session.role === 'admin_cabang') {
    syncPosSessionIfNeeded(session);
  }

  let verifiedUser = null;
  try {
    verifiedUser = await verifyUser(session);
  } catch (err) {
    console.warn('EJ_ROLE_GUARD verify warning:', err);
  }

  const effectiveRole = verifiedUser?.role || session.role;
  const isActive = verifiedUser ? verifiedUser.isActive !== false : true;
  const roleAllowed =
    config.allowedRoles.includes(effectiveRole) ||
    (config.allowAdminPusatBypass && effectiveRole === 'admin_pusat');

  if (!isActive) {
    renderBlocked('Akun ini sudah dinonaktifkan di Firebase.', session, config);
    return;
  }

  if (!roleAllowed) {
    renderBlocked(`Role ${effectiveRole} tidak diizinkan membuka halaman ini.`, session, config);
    return;
  }

  window.EJ_ROLE_GUARD_CONTEXT = {
    session,
    user: verifiedUser || session,
    role: effectiveRole
  };

  showPage();
}

bootGuard();
