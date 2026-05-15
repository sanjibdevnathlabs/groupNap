const MB_PER_TAB = 300;

async function getProtectedUrls() {
  const { protectedUrls } = await chrome.storage.local.get("protectedUrls");
  return protectedUrls || [];
}

function isInternalUrl(url) {
  if (url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("devtools://")) return true;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return true;
  return false;
}

function isProtected(tab, patterns) {
  if (tab.active || tab.pinned || tab.discarded) return true;
  if (tab.audible) return true;
  const url = tab.url || "";
  if (isInternalUrl(url)) return true;
  return patterns.some((pattern) => url.includes(pattern));
}

function isGenuinelyProtected(tab, patterns) {
  if (tab.active || tab.pinned) return true;
  if (tab.audible) return true;
  const url = tab.url || "";
  if (isInternalUrl(url)) return true;
  return patterns.some((pattern) => url.includes(pattern));
}

function formatBytes(mb) {
  if (mb < 1000) return `${mb}M`;
  const gb = mb / 1000;
  if (gb >= 10) return `${Math.round(gb)}G`;
  return `${gb.toFixed(1)}G`;
}

async function countNappingTabs() {
  const tabs = await chrome.tabs.query({ discarded: true });
  return tabs.filter((t) => t.groupId !== undefined && t.groupId !== -1).length;
}

async function updateBadge() {
  const count = await countNappingTabs();
  const savedMB = count * MB_PER_TAB;
  if (savedMB > 0) {
    chrome.action.setBadgeText({ text: formatBytes(savedMB) });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

async function getStats() {
  const { stats } = await chrome.storage.local.get("stats");
  return stats || { totalDiscarded: 0, totalCollapses: 0, totalSkipped: 0 };
}

async function saveStats(stats) {
  await chrome.storage.local.set({ stats });
}

chrome.tabGroups.onUpdated.addListener(async (group) => {
  if (!group.collapsed) {
    updateBadge();
    return;
  }

  const tabs = await chrome.tabs.query({ groupId: group.id });
  const patterns = await getProtectedUrls();
  const targets = tabs.filter((tab) => !isProtected(tab, patterns));
  const genuinelyProtected = tabs.filter((tab) => !tab.discarded && isGenuinelyProtected(tab, patterns)).length;

  const results = await Promise.allSettled(
    targets.map((tab) => chrome.tabs.discard(tab.id))
  );

  const discarded = results.filter((r) => r.status === "fulfilled").length;

  const stats = await getStats();
  stats.totalDiscarded += discarded;
  stats.totalCollapses += 1;
  stats.totalSkipped += genuinelyProtected;
  await saveStats(stats);

  await updateBadge();

  const count = await countNappingTabs();
  console.log(
    `[GroupNap] "${group.title || group.id}" collapsed: ` +
      `${discarded} napped, ${genuinelyProtected} protected | ` +
      `Saving ~${formatBytes(count * MB_PER_TAB)}`
  );
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === "complete" || changeInfo.discarded === false) {
    updateBadge();
  }
});

chrome.tabs.onRemoved.addListener(() => updateBadge());

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "getActiveNaps") {
    countNappingTabs().then((count) => sendResponse({ count }));
    return true;
  }
  if (msg.type === "wakeAllNaps") {
    chrome.tabs.query({ discarded: true }).then(async (tabs) => {
      const grouped = tabs.filter((t) => t.groupId !== undefined && t.groupId !== -1);
      await Promise.allSettled(grouped.map((t) => chrome.tabs.reload(t.id)));
      await updateBadge();
      sendResponse({ woken: grouped.length });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => updateBadge());
chrome.runtime.onStartup.addListener(() => updateBadge());
