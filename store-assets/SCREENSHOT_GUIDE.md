# Screenshots to Capture (1280x800 PNG)

## Screenshot 1: Before — Tab groups expanded, high RAM
1. Open Chrome with multiple tab groups (Work, Personal, etc.)
2. Expand all groups so tabs are visible
3. Open Terminal side-by-side showing RAM command output:
   `ps -eo rss,comm | grep -i 'Google Chrome' | awk '{sum+=$1} END {printf "Total Chrome: %.0f MB\n", sum/1024}'`
4. Capture: Cmd+Shift+4, drag to select 1280x800 area

## Screenshot 2: After — Tab groups collapsed, badge showing savings
1. Collapse all tab groups
2. Badge should show green savings estimate (e.g., "3.6G") on extension icon
3. Run same RAM command — should show significantly less
4. Capture side-by-side: Chrome (collapsed groups + badge) + Terminal (lower RAM)

## Screenshot 3: GroupNap popup with live savings
1. Click the GroupNap icon in the toolbar
2. Popup shows "Saving right now: ~X.X GB" + lifetime stats
3. Capture at 1280x800

## Screenshot 4: Extension in chrome://extensions
1. Navigate to chrome://extensions
2. Show "GroupNap" card with the green icon
3. Capture at 1280x800

## Tips
- Use Cmd+Shift+4 to select exact region
- Resize Terminal + Chrome to fit 1280x800
- Clean up bookmarks bar / hide personal info if visible
- Save as PNG (macOS default)

## Naming
- screenshot-1-before.png
- screenshot-2-after-savings.png
- screenshot-3-popup.png
- screenshot-4-extension.png
