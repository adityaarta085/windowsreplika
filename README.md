# Windows 11 Replica (Netlify Ready)

Replica Windows 11 berbasis HTML/CSS/JS (tanpa framework), dengan fokus pada **fitur-fitur dasar** agar terasa seperti sistem desktop mini di browser.

## Fitur yang tersedia
- Tampilan desktop + taskbar tengah ala Windows 11
- Start Menu + search aplikasi
- Widgets panel
- Quick Settings (Wi-Fi, Bluetooth, Airplane, Night Light)
- Notification Center
- Task View sederhana
- Window controls: minimize, maximize, close
- Aplikasi dasar:
  - File Explorer (mock folder/file)
  - Microsoft Edge replica (address bar, back/forward, reload, iframe browser)
  - Microsoft Store (mock list)
  - Windows Terminal (perintah: `help`, `cls`, `date`, `whoami`, `echo`)
  - Notepad (autosave localStorage)
  - Calculator
  - Settings (toggle dark/light theme)
- Clock & date real-time

## Jalankan lokal
```bash
python3 -m http.server 4173
```
Lalu buka `http://localhost:4173`.

## Deploy ke Netlify
Sudah disiapkan `netlify.toml`:
- Publish directory: `.`
- SPA redirect ke `index.html`

### Via UI Netlify
1. Push repo ke Git provider.
2. Import ke Netlify.
3. Build command kosong.
4. Publish directory `.`.
5. Deploy.

### Via Netlify CLI
```bash
netlify deploy --prod --dir .
```
