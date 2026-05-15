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

document.getElementById("resetBtn").addEventListener("click", async () => {
  await chrome.storage.local.set({
    stats: { totalDiscarded: 0, totalCollapses: 0, totalSkipped: 0 },
  });
  await chrome.runtime.sendMessage({ type: "wakeAllNaps" });
  loadStats();
});

loadStats();
