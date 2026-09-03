# VINTAV Payment Demo

Demo web-only untuk **Payment Center — Kevin Octavianus**.

## Fitur
- Dashboard payment
- E-Wallet
- Bank
- QRIS demo
- Tambah / hapus payment
- Tandai payment utama
- Masking nomor akun
- Riwayat transaksi
- Catat pemasukan/pengeluaran
- Dark / light mode
- Responsive mobile + desktop
- LocalStorage, sehingga demo tetap bekerja offline setelah halaman terbuka
- Tanpa backend dan tanpa API key

## Deploy ke GitHub + Vercel

### GitHub
Buat repository baru, lalu upload:
- `index.html`
- `style.css`
- `app.js`
- `README.md`

### Vercel
1. Login Vercel dengan GitHub.
2. `Add New Project`.
3. Pilih repository ini.
4. Framework: **Other**.
5. Build Command: kosong.
6. Output Directory: `.` (atau kosong/default).
7. Deploy.

Karena ini static website, tidak membutuhkan Node.js/backend untuk demo.

## Penting
Data demo disimpan di browser menggunakan LocalStorage. Jadi data **belum tersinkron antar perangkat**.

Jangan memasukkan password, PIN, OTP, recovery code, atau data perbankan nyata ke versi demo ini. Untuk versi produksi, perlu authentication, database, encryption, dan security architecture.

## QRIS
QR yang tampil sekarang adalah visual placeholder/demo. Untuk penggunaan nyata, nanti tambahkan file QRIS milik sendiri dan fitur secure storage.
