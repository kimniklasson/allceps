# Design Tokens

Extracted from the Figma design file and mapped to Tailwind CSS.

## Colors

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Background | `#FFFFFF` | `bg-white` | Page background |
| Card | `#F5F5F5` | `bg-card` | Exercise cards, category items, form inputs |
| Accent | `#FFD900` | `bg-accent` | Active timer bar, active exercise border |
| Accent (70%) | `rgba(255,217,0,0.7)` | `bg-accent-70` | Timer bar with backdrop blur |
| Text | `#000000` | `text-black` | Primary text |
| Backdrop | `rgba(0,0,0,0.15)` | `bg-backdrop` | Modal overlay |

## Typography

| Role | Font | Weight | Size | Tailwind |
|------|------|--------|------|----------|
| Body | Inter | 400 | 15px | `text-[15px]` |
| Bold | Inter | 700 | 15px | `font-bold text-[15px]` |
| Heading | Inter | 400 | 20px | `text-[20px]` |
| Label | Inter | 700 | 12px | `font-bold text-[12px] uppercase tracking-wider` |
| Timer | Inter | 400 | 31px | `text-[31px]` |

## Border Radius

| Token | Value | Tailwind |
|-------|-------|----------|
| Button | 4px | `rounded-button` |
| Card / Input | 8px | `rounded-card` |
| Modal | 16px | `rounded-modal` |
| Icon button | 56px | `rounded-icon` |
| Circle | 9999px | `rounded-full` |

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| Max width | 393px | App container (mobile viewport) |
| Page padding | 32px (horizontal) | `px-8` |
| Card padding | 16px | `p-4` |
| Modal padding | 16px outer, 16px inner | `px-4` |
| Header height | ~88px | Fixed top with gradient fade |
| Timer bar | ~96px | Fixed bottom with backdrop blur |

## Spacing

| Gap | Value | Usage |
|-----|-------|-------|
| Card gap | 8px | Between exercise cards |
| Section gap | 24px | Between major sections |
| Element gap | 12px | Inside exercise cards |
