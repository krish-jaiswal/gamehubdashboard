# IG Discovery Pipeline (gamehubdashboard)

Daily Instagram content-discovery system for the **gaming niche** (US / UK / EU / Canada).
It scrapes the recent videos/reels from a list of reference accounts, scores them by
**engagement velocity**, writes the winners to a Google Sheet, and pings you on Telegram.

```
Schedule (07:00 IST)
      → Read References tab (Google Sheets)
      → Build one username list
      → Apify Instagram Scraper (run-sync)
      → Score & keep top video/reels
      → Append to "Daily Pulls" tab
      → Telegram digest of the top 5
```

**Stack:** Google Sheets · n8n (self-hosted) · Apify · Telegram.

## What's in this repo

| Path | What it is |
|------|------------|
| `workflow/instagram-discovery-workflow.json` | The importable n8n workflow. |
| `google-sheets/setup-sheet.gs` | Apps Script that builds the 4-tab dashboard in one click. |
| `google-sheets/*.csv` | Header templates for each tab if you'd rather build it by hand. |

---

## Phase 1 — Create the Google Sheet  *(browser)*

Fastest way (recommended):

1. Open [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. **Extensions → Apps Script**, paste the contents of `google-sheets/setup-sheet.gs`, **Save**.
3. Run the `setupIgDiscoveryDashboard` function (authorize on first run).
4. Back in the sheet you now have 4 tabs with headers:

   - **References** — `Handle | Region | Niche Tag | Notes`
   - **Daily Pulls** — `Date | SourceHandle | VideoURL | Likes | Comments | PostedAt | EngagementScore`
   - **Trend Signals** — `Date | Trend/Sound/Hashtag | Region | Source | Notes`
   - **Posted Log** — `DatePosted | VideoSource | CaptionUsed | HashtagsUsed | Views24h | Views7d`

5. Fill in the **References** tab with the Instagram handles you reference
   (bare handle, **no `@`, no URL**) and their Region (US/UK/EU/Canada/Global).

> Prefer doing it manually? Create the tabs yourself and paste the header row from each
> file in `google-sheets/`.

Copy the **spreadsheet ID** from the URL (the long string between `/d/` and `/edit`) —
you'll paste it into n8n in Phase 4.

## Phase 2 — Install / run n8n  *(terminal)*

If you don't have n8n yet, the simplest local route is Docker (so the import CLI is bundled):

```bash
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 \
  -e GENERIC_TIMEZONE="Asia/Kolkata" \
  -e TZ="Asia/Kolkata" \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Or with npm:

```bash
npm install -g n8n
export GENERIC_TIMEZONE="Asia/Kolkata"
n8n start
```

Open **http://localhost:5678** and finish the owner-account setup.

## Phase 3 — Import the workflow  *(terminal or UI)*

**Easiest:** in the n8n UI → top-right **⋯ / Import from File** → pick
`workflow/instagram-discovery-workflow.json`.

CLI alternative:

```bash
# npm install
n8n import:workflow --input=workflow/instagram-discovery-workflow.json

# docker install
docker cp workflow/instagram-discovery-workflow.json n8n:/tmp/wf.json
docker exec -it n8n n8n import:workflow --input=/tmp/wf.json
```

## Phase 4 — Connect credentials  *(browser, n8n UI)*

Open the imported workflow and fill in each node:

1. **Read References** & **Append to Daily Pulls**
   - Create/select a **Google Sheets (OAuth2)** credential.
   - In `documentId`, paste your spreadsheet **ID** (or switch the selector to
     "From list" and pick *IG Discovery Dashboard*).
   - In `sheetName`, re-select the correct tab from the dropdown
     (*References* / *Daily Pulls*).

2. **Call Apify Instagram Scraper**
   - Sign up free at [apify.com](https://apify.com) → **Settings → API & Integrations** → copy token.
   - In the node's **URL**, replace `PASTE_YOUR_APIFY_TOKEN_HERE` with your token.

3. **Notify on Telegram**
   - In Telegram, message **@BotFather**, send `/newbot`, copy the bot token.
   - Add it as a **Telegram** credential in the node.
   - Send your new bot any message, then visit
     `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`, find
     `"chat":{"id": ...}`, and paste that number in place of
     `PASTE_YOUR_TELEGRAM_CHAT_ID_HERE`.

## Phase 5 — Test run  *(browser, n8n UI)*

Click **Execute Workflow** once and watch the nodes go green left-to-right.
Then check the **Daily Pulls** tab — new rows should appear, and Telegram should ping.

Common reds:
- **Apify** → token typo, or your References tab is empty.
- **Sheets** → re-pick `documentId` / `sheetName` from the dropdowns.
- **Telegram** → chat id must be a plain number (and you must have messaged the bot once).

## Phase 6 — Go live  *(browser, n8n UI)*

Flip the **Active** toggle ON. It now runs automatically every day at **07:00 Asia/Kolkata**
(set in the workflow's Settings → timezone) as long as n8n is running.

---

## What I changed vs. the original plan (the bugs that would have bitten you)

The pressure-test was right to be suspicious. The make-or-break details are the field
names and the API call, and the original draft would have failed on several:

1. **Apify field names.** The actor returns `likesCount` / `commentsCount` / `timestamp`
   / `ownerUsername` / `url` — **not** `likes` / `comments`. The scoring node uses the
   real names, so the Sheet columns actually fill in.
2. **Right API call.** Uses the documented synchronous endpoint
   `POST /v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=...`, which
   runs the actor *and* returns the dataset items in one call (no separate "start then
   poll for datasetId" dance).
3. **HTTP timeout.** Set to `600000` ms — the sync endpoint otherwise drops long runs at
   ~5 min and you'd silently lose results.
4. **One run for all handles.** Handles are aggregated into a single `username` array, so
   it's one Apify run per day instead of one per account (cheaper + faster).
5. **Timezone actually set.** "7am IST" only works if the timezone is pinned — it's set on
   the workflow (`Asia/Kolkata`) and recommended as an env var, instead of relying on the
   host's clock.
6. **Auto column mapping.** The Append node maps by header name, and the scoring node emits
   keys identical to your Daily Pulls headers, so nothing silently lands in the wrong column.

## Suggestions / things worth adding

- **EngagementScore = velocity.** It's `(likes + comments×5) / hours_since_posted`, which
  surfaces *rising* content instead of just old viral posts. Tune `COMMENT_WEIGHT` / `TOP_N`
  in the **Score & Format Posts** node.
- **Recency filter.** `onlyPostsNewerThan: "2 days"` keeps pulls fresh and cheap.
- **Residential proxies.** Instagram blocks datacenter IPs aggressively. If runs come back
  empty/blocked, set `proxyConfiguration` to residential in the Apify node body (costs more).
- **Free-tier cost.** Keep References small and `resultsLimit` low at first — the Apify free
  tier is a monthly credit, and IG scraping burns it faster than most actors.
- **Dedup (optional).** Right now the same video can appear on multiple days (useful for
  tracking growth). If you want unique rows, add a "read existing Daily Pulls" step and
  filter by `VideoURL` before appending.
- **Trend Signals / Posted Log** are still manual tabs — natural next step is a second
  workflow that mines hashtags/sounds into Trend Signals, and one that backfills
  `Views24h` / `Views7d` after you post.

---

## Open questions for you

1. **Reference accounts** — give me the real handles (and regions) and I'll seed the
   References tab + the example rows.
2. **Discovery mode** — only scrape accounts you already follow (current), or also
   *discover* new accounts via hashtag/keyword search (e.g. `#gaming`, `#valorant`)?
3. **Volume** — how many reference accounts, and how many posts/account per day? That
   drives Apify cost and whether the 5-min sync window is enough.
4. **Telegram vs. other** — Telegram digest as built, or would you rather Slack/Discord/email?
5. **Hosting** — laptop-only (runs only when the laptop is on) or should I add a cheap
   always-on option (e.g. n8n cloud / a small VPS / Docker on a NAS)?
