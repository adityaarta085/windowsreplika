const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");
const widgetsBtn = document.getElementById("widgetsBtn");
const widgets = document.getElementById("widgets");
const windowEl = document.getElementById("window");
const windowTitle = document.getElementById("windowTitle");
const windowBody = document.getElementById("windowBody");
const startSearch = document.getElementById("startSearch");

const settingsState = {
  accent: localStorage.getItem("win11.accent") || "#4ca6ff",
  wallpaper: localStorage.getItem("win11.wallpaper") || "default",
  darkMode: localStorage.getItem("win11.darkMode") !== "false",
};

function applySettings() {
  document.documentElement.style.setProperty("--accent", settingsState.accent);
  document.body.classList.toggle("light", !settingsState.darkMode);
  document.body.classList.toggle("wallpaper-sunset", settingsState.wallpaper === "sunset");
  document.body.classList.toggle("wallpaper-aurora", settingsState.wallpaper === "aurora");
}

applySettings();

const appData = {
  explorer: {
    title: "File Explorer",
    body: () => `
      <div class="explorer-layout">
        <aside class="explorer-sidebar">
          <button>Home</button><button>Desktop</button><button>Downloads</button>
          <button>Documents</button><button>Pictures</button><button>Music</button>
        </aside>
        <section>
          <h3>Quick access</h3>
          <div class="file-grid">
            <div class="file-card">📄 Resume.docx</div>
            <div class="file-card">📊 Budget.xlsx</div>
            <div class="file-card">🖼️ Holiday.png</div>
            <div class="file-card">🎬 Demo.mp4</div>
          </div>
        </section>
      </div>`,
  },
  edge: {
    title: "Microsoft Edge",
    body: () => `
      <div class="edge-app">
        <div class="edge-tabs"><button class="active">New tab</button><button id="edgeNewTab">+</button></div>
        <form id="edgeForm" class="edge-toolbar">
          <button type="button" id="edgeBack">←</button>
          <button type="button" id="edgeForward">→</button>
          <button type="button" id="edgeReload">⟳</button>
          <input id="edgeUrl" placeholder="Search or type URL (example: wikipedia.org)" value="https://example.com" />
          <button type="submit">Go</button>
          <button type="button" id="edgeOpenExternal">Open ↗</button>
        </form>
        <p class="edge-tip">Mode browser memakai Netlify Function proxy. Situs tertentu tetap bisa memblokir konten.</p>
        <iframe id="edgeFrame" class="edge-frame" src="/.netlify/functions/proxy?url=https%3A%2F%2Fexample.com" referrerpolicy="no-referrer"></iframe>
      </div>`,
    mount: mountEdge,
  },
  store: {
    title: "Microsoft Store",
    body: () => `<h3>Top free apps</h3><ul><li>Spotify</li><li>WhatsApp</li><li>Netflix</li><li>Instagram</li></ul>`,
  },
  terminal: {
    title: "Windows Terminal",
    body: () => `<pre class="terminal">Microsoft Windows [Version 10.0.22631]\n(c) Microsoft Corporation. All rights reserved.\n\nC:\\Users\\Guest> whoami\ndesktop\\guest\n\nC:\\Users\\Guest> dir\nDocuments  Downloads  Pictures\n\nC:\\Users\\Guest> _</pre>`,
  },
  settings: {
    title: "Settings",
    body: () => `
      <div class="settings-app">
        <aside class="settings-nav">
          <button class="set-link active" data-panel="system">System</button>
          <button class="set-link" data-panel="bluetooth">Bluetooth & devices</button>
          <button class="set-link" data-panel="network">Network & Internet</button>
          <button class="set-link" data-panel="personalization">Personalization</button>
          <button class="set-link" data-panel="apps">Apps</button>
          <button class="set-link" data-panel="accounts">Accounts</button>
          <button class="set-link" data-panel="update">Windows Update</button>
        </aside>
        <section class="settings-panel" id="settingsPanel"></section>
      </div>`,
    mount: mountSettings,
  },
  photos: {
    title: "Photos",
    body: () => `<p>No photos here yet. Add your gallery integration.</p>`,
  },
  notepad: {
    title: "Notepad",
    body: () => `<div class="notepad"><textarea id="noteText" placeholder="Tulis catatan...">Catatan awal...</textarea><button id="saveTxt">Download .txt</button></div>`,
    mount: () => {
      document.getElementById("saveTxt").addEventListener("click", () => {
        const blob = new Blob([document.getElementById("noteText").value], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "notes.txt";
        a.click();
      });
    },
  },
  calculator: {
    title: "Calculator",
    body: () => `<div class="calculator"><input id="calcDisplay" readonly value="0" /><div class="calc-grid">${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((x) => `<button class="calc-btn" data-v="${x}">${x}</button>`).join("")}</div><button id="calcClear">C</button></div>`,
    mount: mountCalculator,
  },
  calendar: {
    title: "Calendar",
    body: () => {
      const d = new Date();
      return `<h3>${d.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</h3><p>Hari ini: ${d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</p>`;
    },
  },
  clockapp: {
    title: "Clock",
    body: () => `<h3 id="clockLarge"></h3><p>World clock: Jakarta, London, Tokyo</p>`,
    mount: () => {
      const el = document.getElementById("clockLarge");
      const timer = setInterval(() => {
        if (!document.body.contains(el)) {
          clearInterval(timer);
          return;
        }
        el.textContent = new Date().toLocaleTimeString("en-GB");
      }, 500);
    },
  },
  paint: {
    title: "Paint",
    body: () => `<div class="paint-wrap"><canvas id="paintCanvas" width="700" height="400"></canvas><button id="paintClear">Clear</button></div>`,
    mount: mountPaint,
  },
  snipping: {
    title: "Snipping Tool",
    body: () => `<p>Gunakan shortcut <strong>Win + Shift + S</strong> di OS asli. Pada replica ini, gunakan browser screenshot tool saat testing.</p>`,
  },
  mediaplayer: {
    title: "Media Player",
    body: () => `<p>Pilih file audio lokal:</p><input type="file" id="audioFile" accept="audio/*" /><audio id="audioPlayer" controls></audio>`,
    mount: () => {
      document.getElementById("audioFile").addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const audio = document.getElementById("audioPlayer");
        audio.src = URL.createObjectURL(file);
        audio.play();
      });
    },
  },
};

function normalizeUrl(url) {
  const value = url.trim();
  if (!value) return "https://example.com";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.includes(".")) return `https://${value}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
}

function mountEdge() {
  const frame = document.getElementById("edgeFrame");
  const input = document.getElementById("edgeUrl");

  const navigate = (rawUrl) => {
    const target = normalizeUrl(rawUrl);
    input.value = target;
    frame.src = `/.netlify/functions/proxy?url=${encodeURIComponent(target)}`;
  };

  document.getElementById("edgeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    navigate(input.value);
  });

  document.getElementById("edgeBack").addEventListener("click", () => frame.contentWindow?.history.back());
  document.getElementById("edgeForward").addEventListener("click", () => frame.contentWindow?.history.forward());
  document.getElementById("edgeReload").addEventListener("click", () => frame.contentWindow?.location.reload());
  document.getElementById("edgeOpenExternal").addEventListener("click", () => window.open(input.value, "_blank", "noopener"));
  document.getElementById("edgeNewTab").addEventListener("click", () => navigate("https://example.com"));
}

function mountSettings() {
  const panel = document.getElementById("settingsPanel");
  const templates = {
    system: `<h3>System</h3><p>Display, sound, notifications, power.</p>`,
    bluetooth: `<h3>Bluetooth & devices</h3><p>Mouse, keyboard, printers.</p>`,
    network: `<h3>Network & Internet</h3><p>Wi‑Fi, Ethernet, VPN, Proxy.</p>`,
    apps: `<h3>Apps</h3><p>Installed apps, startup apps, default apps.</p>`,
    accounts: `<h3>Accounts</h3><p>Your info, email, sign-in options.</p>`,
    update: `<h3>Windows Update</h3><p>You're up to date. Last checked: just now.</p>`,
    personalization: `
      <h3>Personalization</h3>
      <label>Accent color <input type="color" id="accentColor" value="${settingsState.accent}" /></label>
      <label>Wallpaper
        <select id="wallpaperChoice">
          <option value="default">Windows Blue</option>
          <option value="sunset">Sunset</option>
          <option value="aurora">Aurora</option>
        </select>
      </label>
      <label><input type="checkbox" id="darkModeToggle" ${settingsState.darkMode ? "checked" : ""}/> Dark mode</label>
    `,
  };

  const show = (key) => {
    panel.innerHTML = templates[key];
    if (key === "personalization") {
      const wallpaperChoice = document.getElementById("wallpaperChoice");
      wallpaperChoice.value = settingsState.wallpaper;
      document.getElementById("accentColor").addEventListener("input", (e) => {
        settingsState.accent = e.target.value;
        localStorage.setItem("win11.accent", settingsState.accent);
        applySettings();
      });
      wallpaperChoice.addEventListener("change", (e) => {
        settingsState.wallpaper = e.target.value;
        localStorage.setItem("win11.wallpaper", settingsState.wallpaper);
        applySettings();
      });
      document.getElementById("darkModeToggle").addEventListener("change", (e) => {
        settingsState.darkMode = e.target.checked;
        localStorage.setItem("win11.darkMode", String(settingsState.darkMode));
        applySettings();
      });
    }
  };

  document.querySelectorAll(".set-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".set-link").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      show(btn.dataset.panel);
    });
  });

  show("system");
}

function mountCalculator() {
  const display = document.getElementById("calcDisplay");
  let expr = "";
  document.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.v;
      if (v === "=") {
        try {
          expr = String(Function(`return (${expr || 0})`)());
        } catch {
          expr = "Error";
        }
      } else {
        expr += v;
      }
      display.value = expr || "0";
    });
  });
  document.getElementById("calcClear").addEventListener("click", () => {
    expr = "";
    display.value = "0";
  });
}

function mountPaint() {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ffffff";

  const pos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
  window.addEventListener("mouseup", () => (drawing = false));
  document.getElementById("paintClear").addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
}

function openApp(app) {
  const data = appData[app];
  if (!data) return;
  windowTitle.textContent = data.title;
  windowBody.innerHTML = typeof data.body === "function" ? data.body() : data.body;
  windowEl.classList.remove("min");
  startMenu.hidden = true;
  widgets.hidden = true;
  if (data.mount) data.mount();
}

document.querySelectorAll("[data-app]").forEach((el) => {
  el.addEventListener("click", () => openApp(el.dataset.app));
});

startBtn.addEventListener("click", () => {
  startMenu.hidden = !startMenu.hidden;
  widgets.hidden = true;
});

widgetsBtn.addEventListener("click", () => {
  widgets.hidden = !widgets.hidden;
  startMenu.hidden = true;
});

startSearch.addEventListener("input", () => {
  const q = startSearch.value.toLowerCase();
  document.querySelectorAll("#startGrid .pinned").forEach((btn) => {
    btn.hidden = !btn.textContent.toLowerCase().includes(q);
  });
});

document.getElementById("close").addEventListener("click", () => {
  windowTitle.textContent = "Welcome";
  windowBody.innerHTML = "<p>Select an app icon from desktop or taskbar.</p>";
});

document.getElementById("minimize").addEventListener("click", () => {
  windowEl.classList.toggle("min");
});

document.getElementById("maximize").addEventListener("click", () => {
  windowEl.classList.toggle("max");
});

document.getElementById("powerBtn").addEventListener("click", () => {
  startMenu.hidden = true;
  windowTitle.textContent = "Shutting down...";
  windowBody.innerHTML = "<p>Just kidding 😄 this is a web replica.</p>";
});

function tickClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("date").textContent = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

tickClock();
setInterval(tickClock, 1000);

window.addEventListener("click", (e) => {
  const inStart = startMenu.contains(e.target) || startBtn.contains(e.target);
  const inWidgets = widgets.contains(e.target) || widgetsBtn.contains(e.target);
  if (!inStart) startMenu.hidden = true;
  if (!inWidgets) widgets.hidden = true;
});
