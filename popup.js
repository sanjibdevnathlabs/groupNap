const MB_PER_TAB = 300;

function formatBytes(mb) {
  if (mb < 1000) return `${mb} MB`;
  const gb = mb / 1000;
  if (gb >= 10) return `${Math.round(gb)} GB`;
  return `${gb.toFixed(1)} GB`;
}

async function loadStats() {
  const { stats } = await chrome.storage.local.get("stats");
  const s = stats || { totalDiscarded: 0, totalCollapses: 0, totalSkipped: 0 };
  document.getElementById("discarded").textContent = s.totalDiscarded.toLocaleString();
  document.getElementById("collapses").textContent = s.totalCollapses.toLocaleString();
  document.getElementById("skipped").textContent = s.totalSkipped.toLocaleString();

  const response = await chrome.runtime.sendMessage({ type: "getActiveNaps" });
  const count = response?.count || 0;
  const savedMB = count * MB_PER_TAB;

  if (count > 0) {
    document.getElementById("currentSaving").textContent = `~${formatBytes(savedMB)}`;
    document.getElementById("currentTabs").textContent = `${count} tab${count !== 1 ? "s" : ""} napping`;
  } else {
    document.getElementById("currentSaving").textContent = "—";
    document.getElementById("currentTabs").textContent = "Collapse a tab group to start";
  }
}

async function getProtectedUrls() {
  const { protectedUrls } = await chrome.storage.local.get("protectedUrls");
  return protectedUrls || [];
}

async function saveProtectedUrls(urls) {
  await chrome.storage.local.set({ protectedUrls: urls });
}

function renderUrlList(urls) {
  const list = document.getElementById("urlList");
  if (urls.length === 0) {
    list.innerHTML = '<div class="empty-msg">No custom protected sites</div>';
    return;
  }
  list.innerHTML = urls
    .map(
      (url, i) =>
        `<div class="url-item"><span>${url}</span><button data-index="${i}">&times;</button></div>`
    )
    .join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const urls = await getProtectedUrls();
      urls.splice(parseInt(btn.dataset.index), 1);
      await saveProtectedUrls(urls);
      renderUrlList(urls);
    });
  });
}

async function loadProtectedUrls() {
  const urls = await getProtectedUrls();
  renderUrlList(urls);
}

document.getElementById("addUrlBtn").addEventListener("click", async () => {
  const input = document.getElementById("urlInput");
  const pattern = input.value.trim();
  if (!pattern) return;
  const urls = await getProtectedUrls();
  if (!urls.includes(pattern)) {
    urls.push(pattern);
    await saveProtectedUrls(urls);
    renderUrlList(urls);
  }
  input.value = "";
});

document.getElementById("urlInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("addUrlBtn").click();
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  await chrome.storage.local.set({
    stats: { totalDiscarded: 0, totalCollapses: 0, totalSkipped: 0 },
  });
  await chrome.runtime.sendMessage({ type: "wakeAllNaps" });
  loadStats();
});

loadStats();
loadProtectedUrls();
