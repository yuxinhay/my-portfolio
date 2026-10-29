# ADR 0006: Case-study media as WebP and H.264 MP4, metadata stripped, imported through Vite

- Status: Accepted (amended after the owner's review, same PR)
- Date: 2026-10-29

## Context

Plan step 8 adds case studies with screenshots, flow charts, photos of sketches and screen
recordings. The originals were large PNGs (up to 3228px wide) and `.mov` files, about 26 MB in
total, and could carry device and creation metadata. The site is public on GitHub Pages under
`/my-portfolio/`, must meet WCAG 2.0 AA, and must not shift layout as media loads.

## Decision

- **Images: WebP**, at most 1600px wide (never enlarged), quality 80, alpha kept so transparent
  drawings stay transparent. Converted with sharp, which drops EXIF, XMP and ICC data.
- **Device frames kept, cut along the device edge**: phone and laptop frames show which screen size
  a design is for. Screenshots keep their transparent background. MP4 has no transparency, so each
  recording is cropped to its screen and shown inside a transparent frame image cut from the same
  recording (the black corners flood-filled away, the screen punched out), positioned by
  percentages so both scale together. The device, not the video, shows the focus ring, because a
  ring on the video would sit on the black bezel.
- **Videos: H.264 MP4** (`libx264 -crf 28 -preset slow`, cropped to the screen, `yuv420p`), audio
  removed (`-an`; the recordings have no meaningful sound), `-map_metadata -1 -map_chapters -1`,
  `-movflags +faststart`. A WebP poster from a frame at 0.5s.
- **Imported through Vite** (`import src from '…/x.webp'`), so the `/my-portfolio/` base and
  content hashes are applied at build time. Files live in `src/assets/case-studies/<slug>/`;
  originals are not committed.
- **No layout shift**: every media item declares its pixel `width` and `height`. A test reads the
  WebP headers and fails if they differ.
- **Accessible by default**: images get alt text, and flow charts are summarised in their visible
  captions because alt text cannot carry a whole flow. Videos use native `controls`, `muted`,
  `playsinline`, `preload="none"` and a poster, and are labelled "Prototype video". At the owner's
  request they **play when 60% of the video scrolls into view** (an IntersectionObserver, not the
  `autoplay` attribute) and pause when it leaves. They never start under
  `prefers-reduced-motion: reduce`, stay paused once the visitor pauses them, and do not loop;
  the native controls meet WCAG 2.2.2 (pause, stop, hide). Each has a visible text description
  linked with `aria-describedby` (WCAG 1.2.1, video-only alternative).
  Light-stroke drawings on transparent backgrounds are marked `background: 'dark'` and sit on the
  ink scene.
- Images below the fold use `loading="lazy"` and `decoding="async"`.

## Consequences

- Shipped media is about 2.9 MB (1.4 MB of images and posters, 1.5 MB of video), and a video
  downloads only when it comes into view or is played.
- Conversion is a one-off with the commands above; replacing a file means re-running them and
  updating `width`/`height` (the test catches a mismatch).
- Metadata was checked with exiftool and ffprobe: no device, GPS or creation dates (MP4 dates are
  zero).
