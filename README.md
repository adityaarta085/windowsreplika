# Windows 11 Web Replica

Replica tampilan Windows 11 berbasis HTML/CSS/JS murni, siap deploy ke Netlify.

## Fitur
- Wallpaper + glassmorphism ala Windows 11
- Desktop icons + Start Menu dengan pencarian app
- Dynamic app window (Explorer, Edge, Store, Terminal, Settings, Notepad, Calculator, Calendar, Clock, Paint, Snipping Tool, Media Player)
- Browser app yang bisa dipakai (address bar, back/forward/reload, open external)
- Pengaturan personalisasi (accent color, wallpaper, dark mode) tersimpan di localStorage
- Clock & date real-time
- Netlify Functions proxy untuk mode browsing di dalam app Edge

## Jalankan lokal
1. Jalankan static server (contoh):
   ```bash
   python -m http.server 8080
   ```
2. Buka `http://localhost:8080`.

> Catatan: endpoint proxy `/.netlify/functions/proxy` aktif saat berjalan di Netlify (atau Netlify Dev).

## Deploy ke Netlify
1. Push repo ini ke GitHub/GitLab/Bitbucket.
2. Import project di Netlify.
3. Build command kosongkan, publish directory: `.`
4. Deploy.

Atau via Netlify CLI:
```bash
netlify deploy --prod --dir .
```
