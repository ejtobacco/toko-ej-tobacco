
const EJ_SESSION_KEY = 'ej_role_session_v1';

function ejSessionSafeParse(text) {
  try { return JSON.parse(text); } catch (err) { return null; }
}

function ejSessionLoad() {
  return window.EJ_ROLE_GUARD_CONTEXT?.user
    || window.EJ_ROLE_GUARD_CONTEXT?.session
    || ejSessionSafeParse(localStorage.getItem(EJ_SESSION_KEY) || 'null');
}

function ejRoleLabel(role) {
  const map = {
    admin_pusat: 'Admin Pusat',
    admin_cabang: 'Admin Cabang',
    kurir: 'Kurir',
    customer: 'Customer'
  };
  return map[role] || role || 'Guest';
}

function ejInitials(name) {
  const base = String(name || 'User').trim().split(/\s+/).slice(0, 2).map(v => v[0]?.toUpperCase() || '').join('');
  return base || 'U';
}

function ejInjectStyles() {
  if (document.getElementById('ej-session-badge-style')) return;
  const style = document.createElement('style');
  style.id = 'ej-session-badge-style';
  style.textContent = `
    .ej-session-bar{
      display:flex;align-items:center;justify-content:space-between;gap:12px;
      padding:12px 14px;border-radius:20px;
      background:linear-gradient(180deg, rgba(17,22,32,.88), rgba(12,16,24,.82));
      border:1px solid rgba(255,255,255,.08);
      box-shadow:0 18px 50px rgba(0,0,0,.28);
      margin:0 0 14px 0;
      position:relative;overflow:hidden;
      backdrop-filter:blur(18px);
    }
    .ej-session-bar:before{
      content:"";position:absolute;inset:0;
      background:linear-gradient(180deg, rgba(255,255,255,.03), transparent 35%);
      pointer-events:none;
    }
    .ej-session-left{display:flex;align-items:center;gap:12px;min-width:0;z-index:1}
    .ej-session-avatar{
      width:42px;height:42px;border-radius:15px;
      background:linear-gradient(135deg,#f7e08c 0%,#d4af37 55%,#b8860b 100%);
      color:#151515;font-weight:900;display:grid;place-items:center;
      box-shadow:0 10px 22px rgba(212,175,55,.25);
      flex:0 0 auto;
    }
    .ej-session-meta{min-width:0}
    .ej-session-meta strong{
      display:block;font-size:13px;font-weight:800;color:#f5f7fb;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .ej-session-meta p{
      margin-top:4px;font-size:11px;color:#98a2b3;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .ej-session-right{display:flex;align-items:center;gap:8px;z-index:1}
    .ej-role-pill{
      min-height:32px;padding:0 12px;border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.06);color:#f6dd82;
      font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;
      white-space:nowrap;
    }
    .ej-logout-btn{
      min-height:36px;padding:0 14px;border-radius:999px;border:none;
      background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
      color:#f5f7fb;font-size:12px;font-weight:800;
      display:inline-flex;align-items:center;justify-content:center;gap:8px;
      cursor:pointer;
    }
    @media (max-width:390px){
      .ej-session-bar{flex-direction:column;align-items:flex-start}
      .ej-session-right{width:100%}
      .ej-role-pill,.ej-logout-btn{flex:1}
    }
  `;
  document.head.appendChild(style);
}

function ejInsertBanner(container, session, loginUrl) {
  if (!session) return;
  if (document.getElementById('ej-session-bar')) return;

  const roleText = ejRoleLabel(session.role);
  const branchText = session.branchCode ? ` • ${session.branchCode}` : '';
  const wrap = document.createElement('div');
  wrap.id = 'ej-session-bar';
  wrap.className = 'ej-session-bar';
  wrap.innerHTML = `
    <div class="ej-session-left">
      <div class="ej-session-avatar">${ejInitials(session.name || session.username)}</div>
      <div class="ej-session-meta">
        <strong>${session.name || session.username || 'User aktif'}</strong>
        <p>${roleText}${branchText}</p>
      </div>
    </div>
    <div class="ej-session-right">
      <div class="ej-role-pill">${session.role || 'guest'}</div>
      <button type="button" class="ej-logout-btn" id="ejSessionLogoutBtn">Logout</button>
    </div>
  `;
  container.insertAdjacentElement('afterend', wrap);

  wrap.querySelector('#ejSessionLogoutBtn').addEventListener('click', () => {
    localStorage.removeItem(EJ_SESSION_KEY);
    localStorage.removeItem('ej_pos_cabang_live_settings_v1');
    window.location.href = loginUrl;
  });
}

function ejFindAnchor() {
  return document.querySelector('.topbar')
    || document.querySelector('header')
    || document.querySelector('.app-shell > :first-child')
    || document.querySelector('.app > :first-child');
}

function ejGetLoginUrl() {
  return window.EJ_SESSION_BADGE?.loginUrl || '../portal/';
}

function ejBootSessionBadge() {
  const session = ejSessionLoad();
  if (!session) return;
  ejInjectStyles();
  const anchor = ejFindAnchor();
  if (!anchor) return;
  ejInsertBanner(anchor, session, ejGetLoginUrl());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ejBootSessionBadge);
} else {
  ejBootSessionBadge();
}
