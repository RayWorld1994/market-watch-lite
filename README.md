# Market Watch Lite

A responsive, mobile-first cryptocurrency dashboard built with Angular 21. It consumes the [CoinGecko](https://www.coingecko.com/) public API to display live market data, search/filter assets, and inspect detailed coin information in a modal — all with skeleton loading states and dark mode support.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20.19 or >= 22.12 |
| npm | >= 10 |

## Running Locally

```bash
# 1. Clone the repository
git clone <repository-url>
cd market-watch-lite

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Open **http://localhost:4200** — the app hot-reloads on file changes.

## Building for Production

```bash
npm run build
```

Output is written to `dist/market-watch-lite/`.

## Running Tests

```bash
npm test
```

## Technologies

| Concern | Library | Why |
|---------|---------|-----|
| **Framework** | Angular 21 | Standalone components, signals, and latest control-flow syntax (`@if`, `@for`) for a clean, modern codebase |
| **UI Components** | PrimeNG 21 | Production-ready components (Dialog, Skeleton, Toast, Button, InputText) with built-in accessibility and theming |
| **State Management** | NgRx 21 | Predictable, unidirectional data flow with store, effects, and devtools for the dashboard feature |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with mobile-first responsive design; no custom CSS files for layout |
| **Design Tokens** | Custom ABANK preset | CSS custom properties (`--color-brand`, `--color-surface-*`, `--color-text-*`) wired into PrimeNG's theme system for consistent branding |
| **Charts** | Chart.js 4 | Lightweight sparkline chart for 7-day price history in the asset detail modal |
| **i18n** | Transloco 8 | Runtime language switching (EN/ES) without page reload — translations are lazy-loaded JSON files |
| **HTTP** | Angular HttpClient | API calls through a centralized `CoingeckoService`; global error interceptor shows localized toast messages |
| **Dark Mode** | CSS `.dark` class | Toggleable via header button, persisted to `localStorage`, respects system `prefers-color-scheme` |

## Features

### Core (Phases 0–1)
- Environment-based API configuration
- Global HTTP error interceptor with PrimeNG Toast notifications
- App shell with sticky header, dark mode toggle, and lazy-loaded routing

### Dashboard (Phase 2)
- Top 50 cryptocurrencies by market cap from CoinGecko
- Responsive card grid: 1 column on mobile, 2 on tablet, 3 on desktop
- Color-coded 24h price change (green/red)
- NgRx-powered state management with loading/error handling

### Search (Phase 3)
- Client-side filtering by name or symbol (case-insensitive)
- 300ms debounce with RxJS `debounceTime` + `distinctUntilChanged`
- Informative empty state when no results match

### Asset Detail Modal (Phase 4)
- Full-screen on mobile, centered 600px dialog on desktop
- Coin header with image, name, symbol
- Large price display with 24h change indicator
- 7-day sparkline chart (Chart.js)
- Stats cards: Market Cap, Volume 24h, 24h High, 24h Low
- Sanitized HTML description with "Read more / Show less" toggle
- Skeleton loading state inside the modal

### Skeleton Loading (Phase 5)
- Shimmer-animated skeleton cards while data loads
- Skeleton placeholders in the detail modal
- Smooth transition from skeleton to real content with no layout shift

## Bonus Features

- **Runtime i18n (EN/ES)** — Transloco-based internationalization with instant language switching from the header. Language preference is persisted in `localStorage` and auto-detected from browser settings on first visit. All UI text, error messages, and aria labels are translated.
- **Dark/Light mode** — Persisted theme toggle that integrates with PrimeNG's theme system and Tailwind's dark variant. Respects system preference on first load.
- **Responsive modal** — Asset detail dialog adapts between full-screen (mobile) and centered overlay (desktop) using `matchMedia` listeners.
- **7-day sparkline chart** — Color-coded price history chart rendered with Chart.js inside the detail modal.
- **Accessible** — Aria labels on interactive elements, keyboard navigation (ESC to close modal), screen-reader friendly PrimeNG components.

## Project Structure

```
src/
├── app/
│   ├── core/                     # Interceptors, transloco loader
│   ├── data/
│   │   ├── const/                # API constants
│   │   ├── model/dashboard/      # TypeScript interfaces
│   │   └── service/dashboard/    # CoinGecko HTTP service
│   ├── features/dashboard/       # Dashboard page + child components
│   │   └── components/
│   │       ├── asset-card/       # Individual coin card
│   │       ├── asset-detail/     # Detail modal
│   │       └── asset-list/       # Card grid with loading states
│   ├── layout/                   # Header, main layout
│   ├── shared/components/        # Skeleton card, sparkline chart
│   └── store/dashboard/          # NgRx actions, reducer, effects, selectors
├── environments/                 # API base URL config
└── public/i18n/                  # EN and ES translation JSON files
```
