# Fairytale Dreams

Cross-platform **iOS + Android** app for reading AI-crafted fairy tales for children. Built with [Expo](https://expo.dev) (React Native).

## Product model

| Tier | What you get |
|------|----------------|
| **Free** | **2 unique stories per week** (rolling window). Non-premium catalog titles only. |
| **Premium** | Unlimited reads, full library including premium-only tales, new stories as they publish. |

Stories are **generated over time** by the backend (simulated locally; ready for OpenAI). Some titles are **scheduled** (`availableFrom`) so the catalog grows on a drip schedule.

### Payments

Premium supports three methods (configure on the API server):

| Method | How it works |
|--------|----------------|
| **Card** | Opens secure checkout in browser (`/checkout/:id`). Production: wire Stripe. |
| **Crypto** | Pick **ETH, TRC20, BTC, TON, or SOL** — shows address, amount, and payment memo; polls until confirmed. |
| **Telegram Stars** | `createInvoiceLink` via Bot API, or deep link to your bot. |

Set `TELEGRAM_BOT_TOKEN`, per-chain `CRYPTO_*_ADDRESS` vars, and `PUBLIC_API_URL` in server env. See `.env.example`.

### Reader experience

- **Languages:** In **Family** (or inside a story), pick **story text** language and **narration voice** separately (e.g. read Russian, listen in English). Six languages: English, Spanish, French, German, Portuguese, Russian.
- **Voice-over:** Tap **Listen** on any page for text-to-speech (device voices). **Auto-read** narrates each page and advances when speech finishes.
- **Pictures & motion:** Each page analyzes its paragraph to pick matching photos, emoji characters, colors, and animation (e.g. fireflies → glowing bugs, brook page → water scene).

## Quick start

### Mobile app

```bash
cd fairytale-reader
npm install
npm start
```

- Press `a` for Android emulator, `i` for iOS simulator (macOS), or scan the QR code with **Expo Go** on a device.

**Try Premium in dev:** Profile tab → toggle *Premium access*.

**Simulated purchase:** Subscribe screen → pick a plan (no real charge in this build).

### API (optional — for sync & AI replenishment)

```bash
cd server
npm install
npm start
```

- Health: `http://localhost:3001/health`
- Catalog: `GET http://localhost:3001/api/stories`
- Generate a new story: `npm run generate`

Point the app at your machine when testing on a phone:

```bash
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3001
```

Pull-to-refresh on Home syncs the catalog from the API.

## Project structure

```
fairytale-reader/
├── app/                 # Expo Router screens
├── components/
├── context/             # App state, entitlements
├── data/seedStories.ts  # Bundled catalog (offline-first)
├── services/            # Stories, subscriptions, entitlements
├── server/              # Express API + story generator
└── types/
```

## Ship to App Store & Play Store

1. Install [EAS CLI](https://docs.expo.dev/build/setup/): `npm i -g eas-cli`
2. `eas login` and `eas init` (set `projectId` in `app.json`)
3. Configure subscriptions in App Store Connect & Google Play Console
4. Wire **RevenueCat** (`react-native-purchases`) in `services/subscriptionService.ts` (replace simulated `purchase()`)
5. `eas build --platform all` and `eas submit`

## Real AI story generation

Replace `buildStory()` in `server/scripts/generate-story.js` with an OpenAI (or Anthropic) call. Recommended guardrails:

- System prompt: child-safe, no violence, reading level by `ageMin`/`ageMax`
- Structured JSON output: `title`, `summary`, `content[]`, `theme`
- Human or automated moderation before `POST /api/stories`
- Cron (e.g. weekly): `npm run generate` + optional `availableFrom` stagger

Example env for production API:

```
ADMIN_API_KEY=your-secret
OPENAI_API_KEY=sk-...
```

## Compliance notes (kids app)

- COPPA / GDPR-K: minimize data collection, parental gate for purchases
- Apple **Kids Category** and Google **Designed for Families** have extra policies
- Clearly disclose AI-generated content in store listing and in-app
- Use StoreKit / Play Billing or RevenueCat — never roll your own payment UI for production

## License

Private — all rights reserved unless you add a license file.
