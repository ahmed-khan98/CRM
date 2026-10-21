# CRM Design System

Source of truth for Zytron CRM UI. Reuse these tokens and `src/app/_Components/ui/saas` primitives. Do not introduce a second palette, type scale, or ad-hoc table/button language.

Typography, spacing, radius, and shadows were established earlier. This document adds color, components, layout, responsive, and accessibility rules.

---

## Tokens

Defined in `src/app/styles/tokens.css` and mapped in `src/app/globals.css` `@theme`.

### Typography

| Role | Size | Weight | Use |
|---|---|---|---|
| Label / table header / badge / filter | 11px (`text-xs`) | medium (500) | Quiet chrome |
| Body / buttons / cells | 13–14px (`text-sm` / `text-base`) | regular / medium | Default UI |
| Row primary name | 13–14px | semibold (500 on Roboto) | Entity cell title |
| Page title | 16px (`text-base`) | semibold | One per page — compact header |
| Stat number | 20px (`text-[20px]`) | bold (700) | KPI strip values only |

Font family: **Roboto**. Classes: `.type-label`, `.type-body`, `.type-title`, `.type-stat`.

### PageHeader (compact)

Use `PageHeader` from `@/app/_Components/PageHeader/page` (or saas barrel). `AttendenceHeader` is a thin alias — do **not** wrap either in a second white card.

- Shell: `.header-surface` — `bg-white`, `border-zinc-200`, `shadow-sm`, `rounded` via `--radius-card`, **`padding: 10px 16px`**, `min-height: 52px`
- Icon: `h-8 w-8` quiet bordered square
- Title: `text-base font-semibold leading-tight text-zinc-900`
- Meta: `text-xs text-zinc-500` (NaN-safe count)
- Right: `children` / `actions` / optional `btnName` primary CTA (`h-9` `bg-zinc-950`)

API: `PageHeader({ icon, name|title, length|count, metaLabel, children|actions, btnName, handleEdit })`

### Spacing (4px base)

`4, 8, 12, 16, 20, 24, 32, 40, 48`

| Token | Value | Use |
|---|---|---|
| `--space-page` | 16px | Page container |
| `--space-section` | 16px | Stacked sections |
| `--space-card` | 20px | Card padding |
| `--space-field` | 16px | Form field gap |
| `--space-label` | 8px | Label → control |
| `--space-table-x/y` | 16 / 12 | Table cells |

Utilities: `.page-shell`, `.section-stack`, `.form-stack`, `.card-surface`.

### Radius & shadow

- Cards / empty states / dialogs: `--radius-card` 24px (`rounded-3xl`)
- Buttons / inputs: `--radius-control` 12px (`rounded-xl`)
- Badges: `--radius-pill`
- Card shadow: `--shadow-card`
- Elevated / dialog: `--shadow-elevated`

### Color (semantic)

Keep the existing zinc/slate CRM look. Prefer tokens over raw hex in new work.

**Background:** `--bg-app`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--bg-hover`  
**Text:** `--text-primary`, `--text-secondary`, `--text-muted`, `--text-disabled`, `--text-inverse`  
**Border:** `--border-default`, `--border-subtle`, `--border-strong`, `--border-input`, `--border-focus`  
**Brand:** `--brand-primary` (#0f172a), `--brand-primary-fg`, `--brand-secondary`, `--brand-secondary-fg`  
**Feedback:** `--feedback-success|warning|error|info` (+ `-bg`)  
**CRM status:** `--status-active|inactive|pending|approved|rejected|completed|cancelled|draft|blocked`

---

## Components

Import from `@/app/_Components/ui/saas` (or the barrel `.../saas`).

### Button

Variants: `primary` | `secondary` | `outline` | `ghost` | `destructive` | `link` | `icon`  
Sizes: `sm` (32px) | `md` (40px) | `icon`  
Props: `loading`, `disabled`. Focus-visible ring required.  
Do not invent one-off filled black/red buttons on new screens.

### Forms

- `FormField` — label, required `*`, hint, `role="alert"` error
- `Input` / `Textarea` — `.input-control`, error via `error` + `aria-invalid`
- `Select` — existing `CrmSelect` wrapper
- `Checkbox`, `Switch`
- Height 40px, radius 12px, label 11px muted
- Date pickers keep `LeaveDateField` behavior; style with the same control height

### DataTable

`DataTable` + `EntityCell` + `RowActionsMenu` / `IconActionButton` + `DataTableToolbar`

- Sticky header, 11px medium uppercase muted labels
- Row hover + selected (`bg-slate-50`)
- Skeleton loading, empty state, optional pagination / sort UI / row selection
- Mobile: stacked cards
- Do not fork a new table markup on list pages

### StatusBadge

Statuses: active, inactive, pending, approved, rejected, completed, cancelled, draft, blocked, plus payroll (processing, review, finalized, paid).

Always include a dot + text (status is not color-only).  
`LeaveStatusBadge` and `PayrollStatusBadge` wrap this component.

### Cards

`Card` variants: `default` | `stat` | `info` | `warning` | `success` | `interactive`  
Use existing radius/shadow/padding. No extra decoration.

### Dialog

`Dialog` — sizes `sm|md|lg|xl`, title, description, footer, close control, overlay click to close, `role="dialog"` / `aria-modal`.  
Existing `ModalShell` / feature modals stay; new dialogs should use this language.

### Alert

Tones: `success` | `error` | `warning` | `info`  
Icon + title + body. Toasts stay `react-hot-toast` (dark, 12px radius).

### Loading / empty / error

- Page: `PageLoader`
- Table: `DataTable` `loading` skeletons
- Card: `Skeleton`
- Empty: `EmptyState` (`default` | `search` | `error` | `permission`)

---

## Page layout

Do not redesign pages in this pass. For new screens:

1. `.page-shell` or `.section-stack` (layout already pads the main column)
2. Existing `PageHeader` / `AttendenceHeader` for title + primary action
3. `SearchFilterBar` / module filter bars
4. `DataTable` or `Card` sections
5. One loud title, KPI numbers if needed — everything else quiet

Breadcrumbs: existing `NavBreadcrumb`.

---

## Navigation

Do not change routes or permission logic.

- Top bar height: 56px (`--topbar-h`)
- Nav item target: ~36px (`--nav-item-h`)
- Icons 16px, gap 8px
- Active: existing left pill + slightly lifted surface
- Collapsed tooltips: existing `Tooltip`
- Mobile: existing drawer overlay

---

## Dashboard widgets

KPI: `Card variant="stat"` + `.type-stat` + `.type-label`  
Reuse attendance `StatCard` for clickable filter metrics.  
Charts/activity: information-first, no decorative motion.

---

## Responsive

| Surface | Desktop | Small |
|---|---|---|
| Page | 16px inset, section stack | Same inset, stack vertically |
| Tables | Horizontal scroll + sticky header | `DataTable` card rows |
| Filters | Single bar | Wrap / stack |
| Forms | Multi-column grids OK | One column |
| Modals | Sized `sm–xl` | Full-width inset 16px |
| Sidebar | Persistent | Overlay drawer |

Do not scale a desktop layout down as a single shrink.

---

## Accessibility

- Visible `focus-visible` rings on controls
- Labels associated with `htmlFor` / `id`
- Errors: `role="alert"` and `aria-invalid`
- Dialogs: `aria-modal`, labelled title
- Icon-only buttons: `aria-label`
- Status: color + text + optional dot
- Do not rely on color alone
- Keyboard: native buttons/inputs; do not remove focus outlines

---

## Architecture

- Tokens: `src/app/styles/tokens.css` only
- Primitives: `src/app/_Components/ui/saas/*`
- Module themes (`fleetTheme`, `hrmsUi`) may compose tokens; do not copy a third scale
- Feature badges wrap `StatusBadge`
- No new competing `components/ui` tree unless shadcn is explicitly initialized later

### shadcn / Magic UI

shadcn plugin is available; this CRM is not initialized with `components.json`. Prefer current saas primitives. If shadcn is added later, map it onto these tokens. Magic UI only for rare, purposeful motion — never decoration.

---

## What this pass did not do

- No full page redesigns
- No API, auth, route, or data-flow changes
- Chat, email, and payments still have one-off styles; new work should use this system
