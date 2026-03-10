# Plan: Recipe Image Lightbox with yet-another-react-lightbox

**TL;DR**: Install `yet-another-react-lightbox`, add an `isLightboxOpen` state to `RecipeHero.tsx`, overlay a transparent `cursor-zoom-in` button on the image to trigger it, and render `<Lightbox>` with a single slide. The library handles Escape key, backdrop click, close button, focus management, and accessibility out of the box — zero custom overlay code needed.

---

## Affected file

`src/components/recipes/RecipeHero.tsx` — only file changed.

---

## Step 1 — Install package

```bash
pnpm add yet-another-react-lightbox
```

---

## Step 2 — Update imports

```tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Avatar } from '@/core/components/image/Avatar';
import LikeButton from '@/core/components/LikeButton/LikeButton';
```

---

## Step 3 — Add state

After the existing `showFullSubtitle` state declaration:

```ts
const [isLightboxOpen, setIsLightboxOpen] = useState(false);
```

---

## Step 4 — Add click trigger on the image

Inside the image container `<div>`, after the existing `isMobile` gradient block and before the closing `</div>`, add a full-cover transparent button:

```tsx
{
  /* Clickable overlay — opens lightbox */
}
<button
  type="button"
  onClick={() => setIsLightboxOpen(true)}
  className="absolute inset-0 z-[3] cursor-zoom-in rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
  aria-label="View full-size image"
/>;
```

The existing `hover:scale-105` on the `<Image>` already provides a visual zoom affordance; `cursor-zoom-in` on the button reinforces clickability.

---

## Step 5 — Render the Lightbox

Add just before the closing `</section>` tag:

```tsx
<Lightbox
  open={isLightboxOpen}
  close={() => setIsLightboxOpen(false)}
  slides={[{ src: imageUrl || '/images/broken-image.png', alt: title }]}
  carousel={{ finite: true }}
  render={{
    buttonPrev: () => null,
    buttonNext: () => null,
  }}
/>
```

- `carousel={{ finite: true }}` — disables looping (only one image; no prev/next navigation needed).
- `render.buttonPrev/Next: () => null` — hides the prev/next arrows since there is only one slide.
- The library's default close button, Escape-key handler, and backdrop-click dismiss are all active automatically.

---

## What the library provides for free

| Requirement                    | Handled by |
| ------------------------------ | ---------- |
| Escape key to close            | Built-in   |
| Backdrop click to close        | Built-in   |
| Visible close button           | Built-in   |
| Focus trap while open          | Built-in   |
| `role="dialog"` / `aria-modal` | Built-in   |
| Scroll lock while open         | Built-in   |
| Smooth open/close animation    | Built-in   |
| Touch swipe to close (mobile)  | Built-in   |

---

## Design decisions

| Decision                                                       | Rationale                                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `yet-another-react-lightbox` over custom implementation        | Actively maintained, accessible, lightweight (~15 kB gzipped), zero custom overlay code required                |
| Transparent `<button>` overlay vs wrapping image in `<button>` | Keeps the existing `<Image fill>` layout unchanged; overlay sits on `z-[3]`, above the mobile gradient (`z: 2`) |
| `carousel={{ finite: true }}` + hidden arrows                  | Single-slide UX; no navigation needed                                                                           |
| No additional YARL plugins (Zoom, Thumbnails, etc.)            | Keeps the bundle minimal; can be added later if needed                                                          |
| Existing `hover:scale-105` on `<Image>` retained               | Already signals interactivity; `cursor-zoom-in` on the overlay button reinforces it                             |
