<div align="center">

# 🍊 Portakal Vadisi

**A real-time community clicker game built for the Portakal Suyu streamer community.**

Squeeze the orange, fill up the valley, and unlock surprises!

<br />

[🎮 Live Demo](https://portakal-suyu.vercel.app) · [🐛 Report Bug](https://github.com/ahmetenesdur/portakal-suyu/issues) · [💡 Request Feature](https://github.com/ahmetenesdur/portakal-suyu/issues)

</div>

<br />

## 🍊 About the Project

**Portakal Vadisi** (Orange Valley) is a real-time, community-driven clicker game built for the [Portakal Suyu](https://kick.com/portakalsuyu0) streamer's audience. Players click on an orange character to earn "Litres" of juice, compete on leaderboards, purchase upgrades and cosmetics from the in-game shop, and trigger spectacular on-screen animations during live streams when community goals are reached.

Users sign in via Discord OAuth, and their server roles are automatically synced — subscribers enjoy a **2x score multiplier** as a perk.

### Why This Project?

- 🎯 Boost live stream engagement through interactive gameplay
- 🏆 Daily, weekly, and all-time leaderboard competition
- 🛍️ Virtual shop with upgrades, buffs, and cosmetic items
- 🤖 Chat-reactive orange mascot for OBS overlays
- 📺 Ready-to-use stream overlays with milestone celebrations

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎮 Gameplay

- 🍊 Click to squeeze — every click earns Litres
- ⚡ Role-based multipliers (Subscribers get 2x)
- 🧪 Timed buff consumables (Coffee, Energy Drink, Vitamin C)
- 🔧 Permanent upgrades (Base Power increase)
- 😎 17 unique cosmetic face expressions
- 🔊 Synthesized pop sound effects (Web Audio API)

</td>
<td width="50%">

### 🏗️ Technical

- ⚡ Optimistic UI updates + Supabase Realtime sync
- 🛡️ Server-side 3-rule anti-cheat jury system
- 📦 Click batching (2s buffer, max 50 per batch)
- 🧵 Offloaded chat processing via Web Workers
- 🔒 Secure mutations through Server Actions
- 🗃️ Atomic transactions via PostgreSQL RPC functions

</td>
</tr>
<tr>
<td width="50%">

### 📺 Streamer Tools

- 📊 OBS stream overlay (progress bar + goal tracker)
- 🎭 Chat-reactive orange character overlay
- 💬 Kick chat triggers (500+ Turkish keywords)
- 🧠 Turkish fuzzy matching with typo tolerance
- 🌟 Milestone celebration animations (MVP card, effects)
- 🎄 Seasonal overlay support

</td>
<td width="50%">

### 🏆 Community

- 📈 Daily, weekly, and all-time leaderboards
- 🔐 Secure sign-in via Discord OAuth
- 👑 Automatic Discord server role sync
- 🛒 In-game shop (Upgrades, Buffs, Cosmetics)
- 📱 Fully responsive mobile-first design
- 🌙 Glassmorphism UI with micro-animations

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer               | Technology                                        | Details                                             |
| :------------------ | :------------------------------------------------ | :-------------------------------------------------- |
| **Framework**       | [Next.js 16](https://nextjs.org/)                 | App Router, Server Actions, `"use cache"` directive |
| **UI**              | [React 19](https://react.dev/)                    | React Compiler enabled                              |
| **Language**        | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict mode                                         |
| **Styling**         | [Tailwind CSS v4](https://tailwindcss.com/)       | PostCSS plugin, `@theme` directive                  |
| **Auth & DB**       | [Supabase](https://supabase.com/)                 | Auth, PostgreSQL, Realtime Channels                 |
| **Animation**       | [Framer Motion](https://motion.dev/)              | Layout animations, AnimatePresence                  |
| **Icons**           | [Iconify](https://iconify.design/)                | Lucide & Simple Icons sets                          |
| **Notifications**   | [react-hot-toast](https://react-hot-toast.com/)   | Toast notifications                                 |
| **Analytics**       | [Vercel Analytics](https://vercel.com/analytics)  | Performance & usage metrics                         |
| **Testing**         | [Vitest](https://vitest.dev/)                     | Unit tests + V8 coverage                            |
| **Linting**         | ESLint 9 + Prettier                               | Import sorting, unused import cleanup               |
| **Package Manager** | [pnpm](https://pnpm.io/)                          | Fast, efficient dependency management               |

---

### Data Flow — Click Lifecycle

```
Click → Optimistic UI update → Add to click queue
                                       │
                                  2s buffer
                                       │
                              Invoke Server Action
                                       │
                            Anti-cheat validation
                                       │
                             Supabase RPC call
                                       │
                            Realtime broadcast ──→ All connected clients update
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.18
- **pnpm** ≥ 9.0 (`npm install -g pnpm`)
- A **Supabase** project ([supabase.com](https://supabase.com))
- A **Discord** application & bot ([discord.com/developers](https://discord.com/developers))
- A **Kick** developer account (optional — required for chat overlay)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmetenesdur/portakal-suyu.git
cd portakal-suyu

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your own credentials

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

The following environment variables are required to run the project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key (server-side only)

# Discord
DISCORD_BOT_TOKEN=                  # Discord bot token
DISCORD_GUILD_ID=                   # Discord server (guild) ID
DISCORD_SUBSCRIBER_ROLE_ID=         # Subscriber role ID
DISCORD_BROADCASTER_ID=             # Broadcaster's Discord user ID

# Kick (Optional — required for chat overlay)
KICK_CLIENT_ID=                     # Kick API client ID
KICK_CLIENT_SECRET=                 # Kick API client secret
```

### Supabase Setup

The project requires the following database tables:

| Table                | Description                                    |
| :------------------- | :--------------------------------------------- |
| `profiles`           | User profiles — score, role, buffs, base power |
| `global_stats`       | Global click counter and milestone info        |
| `leaderboard_daily`  | Daily leaderboard entries                      |
| `leaderboard_weekly` | Weekly leaderboard entries                     |
| `shop_items`         | Shop item definitions                          |
| `user_inventory`     | User inventory (owned items)                   |

Two RPC functions are also required:

- `secure_increment_clicks(p_count)` — Atomically increment click counts
- `secure_purchase_item(p_item_id)` — Validate and process purchases

> **Note:** Supabase **Realtime** must be enabled for the `profiles` and `global_stats` tables.

### Discord Setup

1. Create an application on the [Discord Developer Portal](https://discord.com/developers/applications)
2. **OAuth2** → Add redirect URL: `https://YOUR_DOMAIN/auth/callback`
3. In Supabase Dashboard → Authentication → Providers → Enable Discord
4. Invite the bot to your server with the guild members read permission

---

## 📺 OBS Overlay System

The project includes 3 ready-to-use overlays designed for OBS Studio **Browser Sources**. All overlays use transparent backgrounds — no custom CSS needed in OBS.

### 1. Stream Overlay — `/overlay`

The main stream overlay featuring a live progress bar, goal tracker, and mini leaderboard.

```
URL:    https://portakal-suyu.vercel.app/overlay
Width:  1920
Height: 1080
```

**Features:**

- 📊 Live progress bar (current Litres / goal)
- 🏆 Top 3 leaderboard widget
- 🌊 Milestone celebration animation (rising liquid, particles, god rays, screen shake)
- 👤 MVP card — displays the user who completed the goal
- 🧪 Test mode available via `?test=true`

### 2. Orange Character Overlay — `/orange-overlay`

An interactive orange character that reacts to Kick chat messages in real time.

```
URL:    https://portakal-suyu.vercel.app/orange-overlay?chatroomId=YOUR_CHATROOM_ID
Width:  400
Height: 400
```

**Features:**

- 🎭 Dynamic face changes based on chat message triggers
- 💬 Speech bubble responses
- 🧠 3-mood system (Chill, Energy, Silly) with automatic transitions
- 🫧 Blink and idle animations for each face
- 🧪 Test mode available via `?test=true`

### 3. Seasonal Overlay — `/christmas-overlay`

A simple video-based overlay for seasonal/holiday themes.

---

## 🎮 Game Mechanics

### Score Formula

```
Click Value = Base Power × Role Multiplier × Buff Multiplier
```

| Component           | Default | Description                                    |
| :------------------ | :------ | :--------------------------------------------- |
| **Base Power**      | 1       | Increased by purchasing upgrades from the shop |
| **Role Multiplier** | 1x / 2x | Subscribers: 2x — all other roles: 1x          |
| **Buff Multiplier** | 1x+     | Product of all active buff multipliers         |

**Example:** Base 2 × Subscriber 2x × Coffee 2x × Energy 3x = **24 Litres per click**

### Shop System

| Type               | Duration  | Examples                                                |
| :----------------- | :-------- | :------------------------------------------------------ |
| 🔧 **Upgrades**    | Permanent | Mechanical Juicer, Hydraulic Press, Laser Cutter        |
| 🧪 **Consumables** | Timed     | Coffee (2 min), Energy Drink (3 min), Vitamin C (1 min) |
| 😎 **Cosmetics**   | Permanent | Cool, King, Ninja, Devil, Robot, Pirate, Clown...       |

> **Note:** Litres spent in the shop **do not affect leaderboard rankings**. Only Litres earned from clicks determine your position.

### Role Hierarchy

| Role           | Multiplier | Score Saved | Shop Access |
| :------------- | :--------- | :---------- | :---------- |
| 👑 Broadcaster | Special    | ✅          | ✅          |
| ⭐ Subscriber  | 2x         | ✅          | ✅          |
| 👤 Member      | 1x         | ✅          | ✅          |
| 👻 Guest       | 1x         | ❌          | ❌          |

Guests are users who signed in via Discord but are not a member of the Discord server. Anonymous visitors can still click, but their scores are not recorded.

---

## 💬 Kick Chat Integration

The Orange Overlay connects to a Kick.com live chatroom, analyzes incoming messages, and triggers visual reactions on the orange character.

### How It Works

1. A **dedicated Web Worker** connects to the Kick Pusher WebSocket
2. Incoming messages are batched and processed every **100ms**
3. **Trigger detection** runs against a dictionary of 500+ keywords (exact match + fuzzy matching)
4. When a match is found, the orange changes its face and displays a speech bubble reaction

### Supported Reaction Types

| Type        | Example Triggers                     | Example Response                 |
| :---------- | :----------------------------------- | :------------------------------- |
| 👋 Greeting | merhaba, selam, sa, hey, günaydın... | "Hoş geldin {user}! 🍊"          |
| 🚪 Farewell | bb, bye, görüşürüz, güle güle...     | "Hoşça kal {user}! ✨"           |
| 🎉 Cheer    | helal, süper, gg, nice, pog, kral... | "Teşekkürler {user}! 🍊✨"       |
| ❓ Question | nasılsın, naber, ne haber...         | "İyiyim {user}, teşekkürler! 🍊" |

### Fuzzy Matching Engine

A custom fuzzy matching system designed to handle Turkish chat typos:

- **Character normalization:** `ş→s`, `ğ→g`, `ü→u`, `ö→o`, `ç→c`, `ı→i`
- **Repeated character removal:** `"selammmm"` → `"selam"`
- **Levenshtein distance** based similarity scoring
- **Dynamic thresholds** based on word length (short words require exact match, longer words allow more tolerance)
- **Multi-word phrase matching** with word boundary checks

### Rate Limiting

- **User cooldown:** Same user can only trigger a reaction once every 30 seconds
- **Global cooldown:** Minimum 2 seconds between any two reactions

---

## 🛡️ Anti-Cheat System

A server-side **3-Rule Jury** system that analyzes click patterns in every batch. Any single rule violation causes the entire batch to be rejected:

| #   | Rule                 | Threshold              | What It Detects                                           |
| :-- | :------------------- | :--------------------- | :-------------------------------------------------------- |
| 1   | **Temporal Entropy** | `deltaVariance < 12ms` | Robotic rhythm — unnaturally uniform click intervals      |
| 2   | **CPS Limit**        | `CPS > 22`             | Superhuman clicks per second (physiological limit ~22)    |
| 3   | **Metronomic CV**    | `CV < 0.02`            | Coefficient of variation too low — machine-like precision |

Additional security layers:

- ⏱️ **Batch size limit:** Maximum 50 clicks per submission
- 🔐 **Server Actions:** All mutations run server-side (`"use server"`)
- 🗄️ **RPC Functions:** Critical operations execute as PostgreSQL functions
- 🍪 **Session middleware:** Supabase session refreshed on every request
- 🚫 **Guest restrictions:** Guests cannot record scores or access the shop

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a **Pull Request**

### Code Style

This project enforces consistent code style through automated tooling:

- **ESLint** — Run `pnpm lint` to check for issues
- **Prettier** — Run `pnpm format` to auto-format
- **TypeScript** — Run `pnpm typecheck` to verify types
- **Import sorting** is automatic via [simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)
- **Unused imports** are flagged and auto-removed
