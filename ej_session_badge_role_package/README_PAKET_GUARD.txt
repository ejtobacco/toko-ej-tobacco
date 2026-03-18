PAKET FILE SUDAH DITEMPELI GUARD

Isi paket:
- index.html → Master admin pusat realtime (guard admin_pusat)
- portal/index.html → Portal login role
- admin/index.html → Admin pusat (guard admin_pusat)
- pos-cabang/index.html → POS cabang live (guard admin_cabang + admin_pusat)
- kurir/index.html → Panel kurir (guard kurir + admin_pusat)
- stok-pusat/index.html → Stok pusat (guard admin_pusat)
- dashboard-cabang/index.html → Dashboard gabungan cabang (guard admin_pusat)
- laporan-cabang/index.html → Laporan cabang (guard admin_pusat)
- sync-cabang/index.html → Sync manual cabang (guard admin_pusat)
- customer/index.html → Customer page (publik / tanpa guard)
- assets/ej_role_guard.js → File guard reusable
- app_users_import.json → Contoh user login untuk Firebase

LANGKAH PASANG:
1. Upload seluruh isi paket ke repo dengan struktur folder yang sama.
2. Import app_users_import.json ke node Firebase: app_users
3. Pastikan rule minimal:
   "app_users": { ".read": true, ".write": true }
4. Buka /portal/ untuk login berdasarkan role.

CATATAN:
- Customer sengaja dibiarkan publik. Kalau ingin customer wajib login juga, customer/index.html bisa diproteksi di tahap berikutnya.
- Root index.html sekarang hanya bisa dibuka admin_pusat.
