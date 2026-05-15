# Chrome Web Store Listing — Copy/Paste into Dashboard

## Short Description (manifest — 132 chars max)
Already in manifest.json:
"Collapse a tab group, free RAM instantly. Tabs nap until you need them."

## Detailed Description (Store Listing tab — up to 16K chars)

Collapse a tab group. RAM freed instantly. Tabs nap until you need them.

Chrome's tab groups are purely visual — collapsing a group hides tabs in the tab strip but keeps every renderer process alive, consuming hundreds of megabytes each. Memory Saver only kicks in after minutes of inactivity.

GroupNap bridges this gap. When you collapse a tab group, all eligible tabs are immediately discarded via Chrome's native tabs.discard() API. Renderer processes are killed, RAM is reclaimed, and tabs stay in the strip — click one to wake it up.

REAL-WORLD RESULTS
Tested on a 24 GB Mac with 20 open tabs across multiple groups:
- Chrome RAM: 9,000 MB → 5,200 MB (3,800 MB freed)
- Renderer processes: 30 → 19 (11 killed instantly)

SMART PROTECTION
Not all tabs should nap. GroupNap automatically skips:
- The active (focused) tab
- Pinned tabs
- Tabs playing audio or video
- Already-discarded tabs
- Internal Chrome pages (chrome://, devtools://)
- Custom URL patterns you configure

LIVE SAVINGS DASHBOARD
Click the GroupNap icon to see:
- Saving right now — estimated RAM freed from currently napping tabs
- Lifetime stats — total tabs napped, groups collapsed, tabs protected
- Reset all — wakes every napping tab and clears stats
The badge on the icon shows live RAM savings (e.g., "3.6G"). It decreases as you reopen tabs.
All data is stored locally on your device and never transmitted anywhere.

ZERO DATA COLLECTION
- No network requests. Ever.
- No analytics, no tracking, no telemetry.
- No host permissions — the extension never reads page content.
- Only uses tabGroups, tabs, and storage permissions for local tab management.
- Full source code available on GitHub.

HOW IT WORKS
1. Listens for tab group collapse events (chrome.tabGroups.onUpdated)
2. Queries all tabs in the collapsed group
3. Filters out protected tabs
4. Naps the rest (chrome.tabs.discard)
5. Badge shows estimated RAM saved right now (e.g., "3.6G")
6. Click the icon for live savings dashboard + lifetime stats

WHAT HAPPENS TO NAPPING TABS
- Tab stays visible in the tab strip with its title and favicon
- WebSocket connections are severed (apps reconnect on reload)
- Unsaved form data is lost (save before collapsing)
- Scroll position resets to top
- Login sessions survive (cookies and localStorage are preserved)

TIP: Keep tabs you need always-connected (Slack, Meet) in a group you never collapse, or add their URLs to the PROTECTED_URLS list in the extension.

## Category
Productivity

## Language
English

## Single Purpose Description (Privacy tab)
Naps (discards) tabs to free memory when their Chrome tab group is collapsed.

## Permission Justifications (Privacy tab)

### tabs
Required to query tab properties (active, pinned, audible, URL, discarded status) and to call chrome.tabs.discard() to free memory for inactive tabs in collapsed groups.

### tabGroups
Required to listen to chrome.tabGroups.onUpdated events to detect when a user collapses a tab group, which triggers the tab napping behavior.

### storage
Required to persist usage statistics (tabs napped, groups collapsed, tabs protected) locally on the user's device. Data is never transmitted externally.

## Data Usage Disclosures (Privacy tab)
- Personally identifiable information: NO
- Health information: NO
- Financial and payment information: NO
- Authentication information: NO
- Personal communications: NO
- Location: NO
- Web history: NO
- User activity: NO
- Website content: NO

## Remote Code Declaration
No, I am not using remote code.

## Screenshots Needed (1280x800 PNG)
1. Before/after RAM comparison in terminal
2. Chrome with tab groups collapsed, badge showing RAM saved (e.g., "3.6G")
3. GroupNap popup showing live savings + lifetime stats
4. chrome://extensions page showing GroupNap

## Small Promo Tile
440x280 PNG — generated in store-assets/promo-small.png
