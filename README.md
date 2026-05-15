# GroupNap

A Chrome extension that **puts tabs to sleep when their tab group is collapsed**, freeing RAM instantly.

Chrome's tab groups are purely visual — collapsing a group hides tabs in the strip but keeps every renderer process alive in memory. GroupNap bridges the gap: collapse a group, and all eligible tabs are immediately discarded via `chrome.tabs.discard()`, killing their renderer processes and reclaiming hundreds of megabytes per tab.

Tabs remain in the tab strip. Click one to wake it up.

## How It Works

1. Listens to `chrome.tabGroups.onUpdated` for collapse events
2. Queries all tabs in the collapsed group
3. Filters out protected tabs (active, pinned, audible, internal URLs)
4. Calls `chrome.tabs.discard()` on the rest — renderer killed, RAM freed
5. Badge shows estimated RAM saved right now (e.g., "3.6G")
6. Click the extension icon for live savings + lifetime stats

## Results

Tested on a 24 GB MacBook with 20 tabs across multiple groups:

| Metric | Before | After Collapse | Saved |
|--------|--------|----------------|-------|
| Chrome RAM | 9,000 MB | 5,200 MB | **3,800 MB** |
| Renderer processes | 30 | 19 | **11 killed** |

## Protected Tabs (Never Napped)

- **Active tab** — Chrome doesn't allow discarding the focused tab
- **Pinned tabs** — intentionally persistent
- **Audible tabs** — playing audio/video won't be interrupted
- **Already discarded** — no-op
- **Internal URLs** — `chrome://`, `chrome-extension://`, `devtools://`
- **Custom allowlist** — edit `PROTECTED_URLS` in `background.js`

## Install (Unpacked)

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select this directory
5. Collapse a tab group and watch the badge show RAM saved

## Install (Chrome Web Store)

Coming soon.

## Popup

Click the GroupNap icon in the toolbar to see:
- **Saving right now** — estimated RAM saved from currently napping tabs (live, decreases as tabs reload)
- **Lifetime stats** — total tabs napped, groups collapsed, tabs protected

**Reset all** — clears lifetime stats AND wakes all napping tabs (reloads them), bringing savings to zero.

## What Gets Lost When a Tab Naps

| What | Lost? | Recovery |
|------|-------|----------|
| WebSocket connections | Yes | App reconnects on reload |
| Unsaved form data | Yes | Save before collapsing |
| Scroll position | Yes | Page reloads to top |
| Login sessions | No | Cookies/localStorage survive |
| Tab title & favicon | No | Preserved in tab strip |

## Permissions

| Permission | Why |
|------------|-----|
| `tabGroups` | Detect when a tab group is collapsed |
| `tabs` | Query tab state and call `discard()` |
| `storage` | Persist usage stats locally (never transmitted) |

No host permissions. No network requests. No data leaves your device.

## Configuration

Edit `PROTECTED_URLS` in `background.js` to add sites that should never be napped:

```javascript
const PROTECTED_URLS = [
  "meet.google.com",
  "docs.google.com",
];
```

## License

MIT
