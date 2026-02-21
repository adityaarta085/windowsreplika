const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");
const widgetsBtn = document.getElementById("widgetsBtn");
const widgets = document.getElementById("widgets");
const windowEl = document.getElementById("window");
const windowTitle = document.getElementById("windowTitle");
const windowBody = document.getElementById("windowBody");

const appData = {
  explorer: {
    title: "File Explorer",
    body: `<p>Quick access</p><ul><li>Desktop</li><li>Documents</li><li>Downloads</li><li>Pictures</li></ul>`,
  },
  edge: {
    title: "Microsoft Edge",
    body: `<p>Welcome to Edge Replica.</p><p>Type anything in your imagination ✨</p>`,
  },
  store: {
    title: "Microsoft Store",
    body: `<p>Top free apps</p><ul><li>Spotify</li><li>WhatsApp</li><li>Netflix</li></ul>`,
  },
  terminal: {
    title: "Windows Terminal",
    body: `<p>C:\\Users\\Guest&gt; whoami</p><p>desktop\\guest</p><p>C:\\Users\\Guest&gt; _</p>`,
  },
  settings: {
    title: "Settings",
    body: `<p>System, Bluetooth, Network & Internet, Personalization.</p>`,
  },
  photos: {
    title: "Photos",
    body: `<p>No photos here yet. Add your gallery integration.</p>`,
  },
};

function openApp(app) {
  const data = appData[app];
  if (!data) return;
  windowTitle.textContent = data.title;
  windowBody.innerHTML = data.body;
  windowEl.classList.remove("min");
  startMenu.hidden = true;
  widgets.hidden = true;
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
