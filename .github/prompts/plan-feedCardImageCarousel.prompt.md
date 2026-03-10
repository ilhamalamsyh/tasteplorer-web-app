# Plan: Feed Card Image Carousel + Lightbox

This adds a reusable `FeedImageCarousel` component that handles multi-image scroll-snap carousel display and `yet-another-react-lightbox` with a zoom-from-card open animation. Two consumer components are updated: `FeedPostCard` (home feed) and `UserPostsList` (profile feed). No API/GraphQL changes — only the data-mapping in `transformFeedData` is extended to forward all image URLs.

---

## Steps

### 1. Create `src/core/components/FeedImageCarousel/FeedImageCarousel.tsx`

A self-contained component accepting:

- `images: string[]` — ordered image URLs
- `aspectRatio?: string` — Tailwind class (default `"aspect-[4/3]"`)

**Carousel markup:**

- Outer wrapper: `relative w-full overflow-hidden` with the given aspect ratio, holds a `ref` for origin tracking
- Inner scroll container: `flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [scroll-behavior:smooth]`; each slide is `flex-none w-full h-full snap-center`; each slide has a `cursor-pointer` `<Image fill className="object-cover">` with an `onClick` handler calling `openLightbox(index)`
- When `images.length > 1`: render semi-transparent prev/next `<button>` arrows (absolute left/right, vertically centered), and dot indicators (absolute bottom-center); prev/next call `scrollRef.current.scrollTo({ left: index * width, behavior: 'smooth' })`; dots reflect current index tracked via a `scroll` event listener computing `Math.round(scrollLeft / scrollWidth * count)`
- Single image: render just the image (no arrows/dots), same click-to-open

**Lightbox:**

- State: `open: boolean`, `index: number`; `originX`/`originY` strings (CSS values, e.g. `"42.3%"` / `"61.7%"`)
- `openLightbox(i)`: reads `containerRef.current.getBoundingClientRect()`, computes `originX = ((rect.left + rect.width/2) / window.innerWidth * 100).toFixed(1) + '%'` and `originY` similarly, sets all four state values
- Renders `<Lightbox>` from `yet-another-react-lightbox` with:
  - `open / close / index / slides` props
  - `plugins={[Zoom]}` (Zoom plugin only)
  - `carousel={{ imageFit: 'contain', finite: images.length === 1 }}`
  - `animation={{ fade: 220 }}`
  - `classNames={{ root: 'yarl__card-origin' }}` — references a global keyframe class
  - `styles={{ root: { '--card-ox': originX, '--card-oy': originY } as React.CSSProperties }}` — CSS vars for origin

---

### 2. Add animation keyframes to `src/app/globals.css`

```css
.yarl__card-origin {
  animation: yarlCardOpen 0.22s ease-out forwards;
}
@keyframes yarlCardOpen {
  from {
    opacity: 0;
    transform: scale(0.08);
    transform-origin: var(--card-ox, 50%) var(--card-oy, 50%);
  }
  to {
    opacity: 1;
    transform: scale(1);
    transform-origin: var(--card-ox, 50%) var(--card-oy, 50%);
  }
}
```

This causes the lightbox backdrop + image to zoom in from the card's center, giving the anchored feel.

---

### 3. Update `src/core/components/FeedPostCard/FeedPostCard.tsx`

- Add `images?: string[]` to `FeedPostCardProps` alongside existing `image: string`
- Replace the current `<div className="relative w-full aspect-[4/3] ...">` image block with `<FeedImageCarousel images={post.images?.length ? post.images : post.image ? [post.image] : []} aspectRatio="aspect-[4/3]" />`
- All other sections (header, text, source card, actions) remain untouched

---

### 4. Update `src/app/feed/page.tsx` — `transformFeedData`

- In the existing function, add `images: sortedImages.map(img => img.imageUrl)` to the returned object (alongside the already-present `image: firstImage?.imageUrl || ''`)
- No other changes to this file — GraphQL query, pagination, infinite scroll all unchanged

---

### 5. Update `src/features/user/components/UserPostsList.tsx`

- Replace the current `{feed.images && feed.images.length > 0 && <div className="relative w-full aspect-video ..."><Image src={feed.images[0].imageUrl} .../></div>}` block with `<FeedImageCarousel images={feed.images.map(img => img.imageUrl)} aspectRatio="aspect-video" />`
- All other sections (header, text, edit/delete menus, like/comment) remain untouched

---

## Verification

- Home feed: posts with multiple images show carousel arrows + dots; clicking any image opens lightbox at correct index zooming from card; single-image posts open lightbox directly
- Profile feed: same behavior using `aspect-video` (16:9) ratio
- Lightbox: Zoom plugin works (pinch/scroll zoom); swipe/arrow nav between slides when multi-image; Escape / click-outside / close button all dismiss; 16:9 content displays in `contain` mode (no cropping)
- Existing layout/styling of card header, text, source link, and action buttons is unchanged
- No new libraries introduced; only `Zoom` plugin imported from `yet-another-react-lightbox/plugins/zoom`

---

## Decisions

- Lightbox: full-screen overlay with CSS `transform-origin` zoom-from-card keyframe animation (via `classNames.root` + CSS custom property `--card-ox`/`--card-oy`), rather than a DOM-contained sub-lightbox
- Card aspect ratio: preserved as-is (`4/3` for home feed, `16/9` for profile); only lightbox uses `imageFit: 'contain'` to enforce no-crop display
- Carousel: CSS `scroll-snap` + arrow buttons (native touch swipe on mobile, clickable arrows on desktop)
- `FeedPostCard` interface: `images?: string[]` added optionally, `image: string` kept for backward compat; fallback chain is `images[]` → `[image]` → `[]`
