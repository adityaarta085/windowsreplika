const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");
const startGrid = document.getElementById("startGrid");
const startSearch = document.getElementById("startSearch");
const widgetsBtn = document.getElementById("widgetsBtn");
const widgets = document.getElementById("widgets");
const quickSettings = document.getElementById("quickSettings");
const notifications = document.getElementById("notifications");
const quickSettingsBtn = document.getElementById("quickSettingsBtn");
const clockBtn = document.getElementById("clockBtn");
const windowEl = document.getElementById("window");
const windowTitle = document.getElementById("windowTitle");
const windowBody = document.getElementById("windowBody");
const taskViewBtn = document.getElementById("taskViewBtn");

const storageKeys = {
  notepad: "win11-replica-notepad",
  theme: "win11-replica-theme",
};

const explorerData = {
  Desktop: ["Project Brief.docx", "Screenshot.png", "ToDo.txt"],
  Documents: ["CV.pdf", "Proposal.pptx", "Meeting Notes.txt"],
  Downloads: ["Installer.exe", "Wallpapers.zip", "Invoice.pdf"],
  Pictures: ["Holiday.jpg", "Family.png", "Design.sketch"],
};

const appList = [
  { id: "explorer", label: "📁 Explorer" },
  { id: "edge", label: "🌐 Edge" },
  { id: "store", label: "🛍️ Store" },
  { id: "terminal", label: "⌨️ Terminal" },
  { id: "notepad", label: "📝 Notepad" },
  { id: "calculator", label: "🧮 Calculator" },
  { id: "settings", label: "⚙️ Settings" },
];

let activeApp = null;
let browserHistory = [];
let historyIndex = -1;

function closePanels() {
  startMenu.hidden = true;
  widgets.hidden = true;
  quickSettings.hidden = true;
  notifications.hidden = true;
}

function normalizeUrl(input) {
  const value = input.trim();
  if (!value) return "https://example.com";
  if (value.includes(" ")) return `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function setActiveTaskButton(app) {
  document.querySelectorAll(".task-btn.open-app").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.app === app);
  });
}

function renderExplorer() {
  const current = Object.keys(explorerData)[0];
  return `
    <div class="explorer">
      <div class="explorer-nav">
        ${Object.keys(explorerData)
          .map((folder) => `<button data-folder="${folder}">📂 ${folder}</button>`)
          .join("")}
      </div>
      <div class="explorer-files" id="explorerFiles">
        ${explorerData[current].map((file) => `<button class="file-item">📄 ${file}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderBrowser() {
  return `
    <div class="browser-toolbar">
      <button id="browserBack">←</button>
      <button id="browserForward">→</button>
      <button id="browserReload">↻</button>
      <input id="browserAddress" value="https://example.com" aria-label="Address bar" />
      <button id="browserGo">Go</button>
    </div>
    <iframe id="browserFrame" class="browser-frame" src="https://example.com" title="Browser"></iframe>
    <div class="browser-note">Beberapa situs bisa memblokir iframe (X-Frame-Options). Jika blank, coba situs lain.</div>
  `;
}

function renderStore() {
  return `<h3>Microsoft Store</h3><ul><li>WhatsApp</li><li>Spotify</li><li>Netflix</li><li>Notion</li></ul>`;
}

function renderTerminal() {
  return `
    <div class="terminal">
      <div class="term-log" id="termLog">C:\\Users\\Guest> help\nPerintah: help, cls, date, whoami, echo [teks]</div>
      <input id="termInput" class="term-input" value="" placeholder="ketik perintah lalu Enter" />
    </div>
  `;
}

function renderNotepad() {
  return `<div class="notepad"><textarea id="notepadText" placeholder="Tulis catatanmu...">${localStorage.getItem(storageKeys.notepad) || ""}</textarea></div>`;
}

function renderCalculator() {
  return `
    <div class="calc">
      <div class="calc-screen" id="calcScreen">0</div>
      <div class="calc-grid">
        ${["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"]
          .map((v) => `<button data-calc="${v}">${v}</button>`)
          .join("")}
        <button data-calc="C" style="grid-column: span 4">Clear</button>
      </div>
    </div>
  `;
}

function renderSettings() {
  const currentTheme = document.body.classList.contains("theme-light") ? "Light" : "Dark";
  return `
    <h3>Settings</h3>
    <p>Theme saat ini: <strong>${currentTheme}</strong></p>
    <button class="pinned" id="toggleThemeBtn">Toggle Dark/Light</button>
    <p style="margin-top:.6rem">Notepad autosave: aktif.</p>
  `;
}

const appRenderers = {
  explorer: { title: "File Explorer", render: renderExplorer },
  edge: { title: "Microsoft Edge", render: renderBrowser },
  store: { title: "Microsoft Store", render: renderStore },
  terminal: { title: "Windows Terminal", render: renderTerminal },
  notepad: { title: "Notepad", render: renderNotepad },
  calculator: { title: "Calculator", render: renderCalculator },
  settings: { title: "Settings", render: renderSettings },
};

function openApp(app) {
  const config = appRenderers[app];
  if (!config) return;

  activeApp = app;
  windowTitle.textContent = config.title;
  windowBody.innerHTML = config.render();
  windowEl.classList.remove("min");
  closePanels();
  setActiveTaskButton(app);
  bindDynamicAppEvents(app);
}

function bindDynamicAppEvents(app) {
  if (app === "explorer") {
    const files = document.getElementById("explorerFiles");
    document.querySelectorAll("[data-folder]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const folder = btn.dataset.folder;
        files.innerHTML = explorerData[folder].map((file) => `<button class="file-item">📄 ${file}</button>`).join("");
      });
    });
  }

  if (app === "edge") {
    const frame = document.getElementById("browserFrame");
    const input = document.getElementById("browserAddress");

    const navigate = (url) => {
      const normalized = normalizeUrl(url);
      if (historyIndex < browserHistory.length - 1) browserHistory = browserHistory.slice(0, historyIndex + 1);
      browserHistory.push(normalized);
      historyIndex = browserHistory.length - 1;
      input.value = normalized;
      frame.src = normalized;
    };

    document.getElementById("browserGo").addEventListener("click", () => navigate(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") navigate(input.value);
    });
    document.getElementById("browserReload").addEventListener("click", () => {
      frame.src = browserHistory[historyIndex] || normalizeUrl(input.value);
    });
    document.getElementById("browserBack").addEventListener("click", () => {
      if (historyIndex > 0) {
        historyIndex -= 1;
        frame.src = browserHistory[historyIndex];
        input.value = browserHistory[historyIndex];
      }
    });
    document.getElementById("browserForward").addEventListener("click", () => {
      if (historyIndex < browserHistory.length - 1) {
        historyIndex += 1;
        frame.src = browserHistory[historyIndex];
        input.value = browserHistory[historyIndex];
      }
    });

    navigate(input.value);
  }

  if (app === "terminal") {
    const input = document.getElementById("termInput");
    const log = document.getElementById("termLog");
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const raw = input.value.trim();
      const [cmd, ...args] = raw.split(" ");
      let output = "";
      if (cmd === "help") output = "Perintah: help, cls, date, whoami, echo [teks]";
      else if (cmd === "cls") {
        log.textContent = "";
        input.value = "";
        return;
      } else if (cmd === "date") output = new Date().toString();
      else if (cmd === "whoami") output = "desktop\\guest";
      else if (cmd === "echo") output = args.join(" ");
      else output = `'${cmd}' tidak dikenali sebagai perintah.`;

      log.textContent += `\nC:\\Users\\Guest> ${raw}\n${output}`;
      input.value = "";
    });
  }

  if (app === "notepad") {
    const area = document.getElementById("notepadText");
    area.addEventListener("input", () => {
      localStorage.setItem(storageKeys.notepad, area.value);
    });
  }

  if (app === "calculator") {
    const screen = document.getElementById("calcScreen");
    let expr = "";
    document.querySelectorAll("[data-calc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.calc;
        if (value === "C") {
          expr = "";
          screen.textContent = "0";
          return;
        }
        if (value === "=") {
          try {
            expr = String(Function(`"use strict"; return (${expr || 0})`)());
            screen.textContent = expr;
          } catch {
            expr = "";
            screen.textContent = "Error";
          }
          return;
        }
        expr += value;
        screen.textContent = expr;
      });
    });
  }

  if (app === "settings") {
    const btn = document.getElementById("toggleThemeBtn");
    btn.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
      localStorage.setItem(storageKeys.theme, document.body.classList.contains("theme-light") ? "light" : "dark");
      openApp("settings");
    });
  }
}

function renderStart(apps) {
  startGrid.innerHTML = apps
    .map((app) => `<button class="pinned" data-start-app="${app.id}">${app.label}</button>`)
    .join("");
  document.querySelectorAll("[data-start-app]").forEach((btn) => {
    btn.addEventListener("click", () => openApp(btn.dataset.startApp));
  });
}

function tickClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("date").textContent = now.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
}

document.querySelectorAll("[data-app]").forEach((el) => {
  el.addEventListener("click", () => openApp(el.dataset.app));
});

startBtn.addEventListener("click", () => {
  startMenu.hidden = !startMenu.hidden;
  widgets.hidden = true;
  quickSettings.hidden = true;
  notifications.hidden = true;
  startSearch.focus();
});

startSearch.addEventListener("input", () => {
  const query = startSearch.value.trim().toLowerCase();
  renderStart(appList.filter((app) => app.label.toLowerCase().includes(query)));
});

widgetsBtn.addEventListener("click", () => {
  widgets.hidden = !widgets.hidden;
  startMenu.hidden = true;
  quickSettings.hidden = true;
  notifications.hidden = true;
});

quickSettingsBtn.addEventListener("click", () => {
  quickSettings.hidden = !quickSettings.hidden;
  notifications.hidden = true;
  startMenu.hidden = true;
  widgets.hidden = true;
});

clockBtn.addEventListener("click", () => {
  notifications.hidden = !notifications.hidden;
  quickSettings.hidden = true;
  startMenu.hidden = true;
  widgets.hidden = true;
});

taskViewBtn.addEventListener("click", () => {
  if (activeApp) {
    windowTitle.textContent = "Task View";
    windowBody.innerHTML = `<h3>Aplikasi aktif</h3><p>${appRenderers[activeApp].title}</p><button class="pinned" id="returnTaskBtn">Kembali ke aplikasi</button>`;
    document.getElementById("returnTaskBtn").addEventListener("click", () => openApp(activeApp));
  } else {
    windowTitle.textContent = "Task View";
    windowBody.innerHTML = "<p>Belum ada aplikasi aktif.</p>";
  }
  closePanels();
  setActiveTaskButton(null);
});

document.getElementById("close").addEventListener("click", () => {
  activeApp = null;
  windowTitle.textContent = "Desktop";
  windowBody.innerHTML = "<h3>Selamat datang</h3><p>Pilih aplikasi dari desktop atau taskbar untuk memulai.</p>";
  setActiveTaskButton(null);
});

document.getElementById("minimize").addEventListener("click", () => {
  windowEl.classList.add("min");
});

document.getElementById("maximize").addEventListener("click", () => {
  windowEl.classList.toggle("max");
});

document.getElementById("powerBtn").addEventListener("click", () => {
  closePanels();
  windowTitle.textContent = "Power";
  windowBody.innerHTML = "<h3>Power menu</h3><p>Sleep • Restart • Shut down (simulasi).</p>";
});

document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => btn.classList.toggle("on"));
});

window.addEventListener("click", (e) => {
  if (![startMenu, startBtn].some((x) => x.contains(e.target))) startMenu.hidden = true;
  if (![widgets, widgetsBtn].some((x) => x.contains(e.target))) widgets.hidden = true;
  if (![quickSettings, quickSettingsBtn].some((x) => x.contains(e.target))) quickSettings.hidden = true;
  if (![notifications, clockBtn].some((x) => x.contains(e.target))) notifications.hidden = true;
});

function initWeather() {
  const weatherWidget = document.getElementById("weatherWidget");
  const hour = new Date().getHours();
  const label = hour < 6 || hour > 18 ? "🌙 Malam cerah" : "🌤️ Cerah berawan";
  weatherWidget.textContent = `${label} · 27°C`;
}

function initTheme() {
  const savedTheme = localStorage.getItem(storageKeys.theme);
  if (savedTheme === "light") document.body.classList.add("theme-light");
}

initTheme();
initWeather();
renderStart(appList);
tickClock();
setInterval(tickClock, 1000);
