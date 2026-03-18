CARA PASANG ROLE GUARD

1. Simpan file guard ini ke repo:
   assets/ej_role_guard.js

2. Lalu tambahkan 2 script ini ke tiap halaman yang mau diproteksi.
   Tempel DI DALAM <head> sebelum </head>.

--------------------------------------------------
CONTOH UNTUK HALAMAN ROOT index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: './portal/',
  fallbackHome: './'
};
</script>
<script type="module" src="./assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK admin/index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK stok-pusat/index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK dashboard-cabang/index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK laporan-cabang/index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK sync-cabang/index.html
(role: admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK pos-cabang/index.html
(role: admin_cabang + admin_pusat)
syncPosSettings aktif agar branchCode dari session ikut tersimpan
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['admin_cabang', 'admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../',
  syncPosSettings: true
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK kurir/index.html
(role: kurir + admin_pusat)
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['kurir', 'admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

--------------------------------------------------
CONTOH UNTUK customer/index.html
(role: customer, admin_pusat)
kalau mau customer guest publik, jangan pasang guard di halaman ini
--------------------------------------------------
<script>
document.documentElement.style.visibility = 'hidden';
window.EJ_ROLE_GUARD = {
  allowedRoles: ['customer', 'admin_pusat'],
  loginUrl: '../portal/',
  fallbackHome: '../'
};
</script>
<script type="module" src="../assets/ej_role_guard.js"></script>

CATATAN PENTING
- Guard ini membaca session dari localStorage:
  ej_role_session_v1
- Guard juga verifikasi user ke Firebase:
  app_users/{userId}
- Jika role salah:
  halaman diblok dan muncul tombol ke portal login
- Jika admin_cabang masuk ke POS:
  branchCode otomatis disalin ke setting POS live

RULES FIREBASE MINIMAL
"app_users": { ".read": true, ".write": true }

STRUKTUR REPO DISARANKAN
index.html
portal/index.html
assets/ej_role_guard.js
admin/index.html
customer/index.html
kurir/index.html
pos-cabang/index.html
sync-cabang/index.html
laporan-cabang/index.html
stok-pusat/index.html
dashboard-cabang/index.html
