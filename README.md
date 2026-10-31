# Infradash

A calm, carefully spaced control room for GitLab infrastructure.

The interface is in Korean. Product names, runner identifiers/tags, and GitLab permission roles (Owner, Maintainer, Developer, Reporter) retain their original names. Korean text uses a self-hosted Noto Sans KR font, Korean date labels, and word-aware wrapping.

**Live:** https://majitap.github.io/infradash-codexend/

This is a separate project from `hanjin` and the existing `infradash` repository. The requested final URL takes precedence over the `infradash` name in the original setup checklist: both repository and Next.js basePath use `infradash-codexend`.

## Stack

Created with `create-next-app` (Next.js, TypeScript, Tailwind, App Router), initialized with `shadcn init`, and built from the `dashboard-01` block. Uses lucide-react icons, Recharts, shadcn/Base UI dialogs, and Sonner toasts.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000/infradash-codexend/.

## Production verification

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
npm run preview
```

Preview serves the actual `out/` export under its deployment basePath. Desktop and mobile browser tests cover routes, navigation, chart ranges, member search/roles/tabs, pagination, downloads, restart simulation, checklist persistence, runtime errors, network isolation, horizontal overflow, and automated WCAG 2.1 AA checks.

## Pages

- Overview: workspace health, KPI trends, interactive 7/30-day chart, runner fleet, action items, CSV report.
- Users: searchable sample directory, role filter, sortable names, pagination, joiners/leavers, member details, filtered CSV.
- Runners: online/offline/paused filters, search, pagination, runner details, confirmation dialog and simulation toast.
- Upgrade: illustrative version path, grouped checklist, browser-local progress, reset, text export.

Every page shares `SidebarProvider + AppSidebar + SiteHeader` through `app/layout.tsx`. The only four navigation entries are Overview, Users, Runners, Upgrade. Layout spacing follows an 8px grid, with small optical adjustments for icons and borders. Fonts are bundled at build time through next/font.

## Data and behavior

All fictional operational data lives in `lib/mock-data.ts`. There are no GitLab APIs, credentials, tokens, remote images, analytics, or runtime third-party network requests. The directory intentionally shows 12 sample accounts from a simulated 1,284-member workspace.

Runner restarts only open an accessible confirmation dialog and show a toast; they never mutate runner status or contact infrastructure. Upgrade versions are illustrative sample data, not a verified GitLab upgrade recommendation.

Only checklist item IDs are saved to browser localStorage, under `infradash-codexend:upgrade:v1`. Invalid storage values are handled and unknown IDs ignored. Progress synchronizes between pages and browser tabs. If storage is unavailable, changes remain in memory for the session.

## Deployment

`next.config.ts` sets:

```ts
output: "export",
basePath: "/infradash-codexend",
trailingSlash: true,
images: { unoptimized: true }
```

`.github/workflows/deploy.yml` installs dependencies, lints, builds, runs browser checks, uploads `out/`, and deploys using GitHub Actions Pages. Pull requests run verification without publishing. Pushes to `main` deploy automatically. Repository Pages Source must be **GitHub Actions** (`build_type: workflow`).

No deployment secrets are required: the workflow uses GitHub's standard short-lived job permissions. `npm start` runs the static preview server; `next start` is intentionally not used for an exported app.
