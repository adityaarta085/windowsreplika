# Windows 11 Web Replica

Replica tampilan Windows 11 berbasis HTML/CSS/JS murni, siap deploy ke Netlify.

## Fitur
- Wallpaper + glassmorphism ala Windows 11
- Desktop icons
- Start Menu (centered taskbar)
- Widgets panel
- Dynamic window (Explorer, Edge, Store, Terminal, dll)
- Clock & date real-time
- Konfigurasi Netlify via `netlify.toml`

## Jalankan lokal
Cukup buka `index.html` di browser.

## Deploy ke Netlify
1. Push repo ini ke GitHub/GitLab/Bitbucket.
2. Import project di Netlify.
3. Build command kosongkan, publish directory: `.`
4. Deploy.

Atau via Netlify CLI:
```bash
netlify deploy --prod --dir .
```
