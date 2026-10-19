# Schedule, Resources, and Gallery

The three sections are rendered after About and before FAQs in
`src/pages/landing-page/landing-page.tsx`. The landing navbar links to `#schedule`,
`#resources`, and `#gallery`. It also opens the existing registration, sign-in,
and sign-up portal through a callback from `App.tsx`. Only the landing navbar is
rendered on the home page; the portal keeps its existing navigation and footer.

## Update the content

- **Schedule:** edit `src/Component/schedule/scheduleData.ts`. The default two-day
  programme is illustrative. Keep `isPreview: true` until the organizers approve
  the programme. Replace null start/end times and venues with confirmed display
  strings in the conference's local timezone. Do not infer dates from the rest
  of the website. For a confirmed date, update the day's `subtitle` as needed.

  The programme is presented in one navy-and-gold frame with compact horizontal
  day tabs, an active gold underline, a separate time column, and a fine vertical
  timeline. Session rows use subtle dividers, with gold ceremony accents and
  quieter breaks. A single notice explains the illustrative programme and TBA;
  each missing detail uses the short TBA label. Times become more prominent when
  supplied. Mobile keeps a narrow time column beside the vertical timeline.

  Category buttons filter ceremonies, committee sessions, and breaks with live
  counts. The filter persists when switching days. Click a session heading to
  expand or collapse its description; times and venues remain visible. The first
  session on each day starts expanded, and each day remembers subsequent choices
  during the current visit. Expand all / Collapse all affects only the visible
  sessions. A filter with no matches offers Show all sessions to reset it.
  Disclosure buttons support native keyboard interaction, ARIA expanded states,
  and reduced-motion settings. Nothing is saved to an account or database.
- **Resources:** edit `src/Component/resources/resourceData.ts`. All initial
  entries are unpublished. Put approved documents in `public/resources/` and use
  root-relative URLs such as `/resources/delegate-handbook.pdf`. Set
  `available: true`, provide `fileUrl`, and optionally add `fileType: 'PDF'` and
  `downloadName`. The type requires a URL for available resources. Local files
  support View and Download; external HTTP(S) documents support View because
  browsers cannot guarantee cross-origin downloads. Verify URLs before publishing.
- **Gallery:** the archive contains 17 user-supplied event photographs in three
  categories: Committee Sessions, Awards & Recognition, and Conference Moments.
  Add further approved photographs to `src/assets/gallery/` and records to
  `src/Component/gallery/galleryData.ts`. Each record needs a unique `id`, `src`,
  meaningful `alt`, and intrinsic `width`/`height`. Optional fields are
  `thumbnailSrc`, `thumbnailSrcSet`, `caption`, `category`, and `year`. Use optimized
  WebP/AVIF thumbnails and a larger original for lightbox viewing. Import image
  files explicitly in `galleryData.ts`; use the imported URL variables for `src`
  and `thumbnailSrc`, and interpolate the thumbnail imports into `thumbnailSrcSet`.
  Vite checks the imports, generates fingerprinted production filenames, and
  respects the configured deployment base path. Do not use `/gallery/...` strings.

  The gallery uses the original framed two-column composition: a vertical photo
  stack on the left and “Every dialogue leaves a memory” on the right, with the
  current photo's category and caption beneath it. Up/down buttons, arrow keys,
  Home/End, and vertical touch swipes shuffle the stack. Portraits and landscapes
  are shown without cropping. On small screens the caption follows the photo.

  **View full gallery**, in the card's top-right corner, opens all 17 photographs
  together in a responsive grid with individual captions. Any thumbnail opens
  the existing enlarged photo viewer. Closing the enlarged photo returns to the
  full gallery; closing the gallery returns to the card. A shared dialog hook
  keeps background scrolling locked until all gallery dialogs are closed and
  restores keyboard focus to the appropriate opener. The category is displayed
  with each caption; the previous inline grid and category filter row are removed.

  An empty custom collection gets a plain empty state. Source filename mapping
  and image processing details are in `src/assets/gallery/README.md`.

  The current assets include 17 lightbox WebPs (longest edge at most 2400 px) and
  34 responsive thumbnails (480 px and 960 px wide). Total web assets are about
  11.0 MiB, compared with 225.8 MiB of originals, a 95.1% reduction. Only thumbnails
  load in the gallery; larger photographs load when opened. Original JPGs remain
  unchanged outside the repository. No event dates, names, or award titles were
  inferred for captions.

## Reuse

Import the default component from its folder and pass custom typed data:

```tsx
<Schedule days={approvedDays} />
<Resources resources={approvedResources} />
<Gallery images={approvedImages} />
```

Types are exported from each folder's `types.ts`. The components use the existing
design variables, Lucide icons, React state, CSS transitions, and scroll reveal
utility. No new dependencies are required. Render each section once per page
because its navigation anchor is stable.

## File map

Created:

```text
CONFERENCE-SECTIONS.md
src/Component/conference/SectionHeading.tsx
src/Component/conference/conference.css
src/Component/schedule/Schedule.tsx
src/Component/schedule/Schedule.css
src/Component/schedule/scheduleData.ts
src/Component/schedule/types.ts
src/Component/resources/Resources.tsx
src/Component/resources/Resources.css
src/Component/resources/ResourceCard.tsx
src/Component/resources/resourceData.ts
src/Component/resources/resourceUtils.ts
src/Component/resources/types.ts
src/Component/gallery/Gallery.tsx
src/Component/gallery/Gallery.css
src/Component/gallery/GalleryLightbox.tsx
src/Component/gallery/GalleryOverview.tsx
src/Component/gallery/useGalleryDialog.ts
src/Component/gallery/galleryData.ts
src/Component/gallery/types.ts
src/Component/navbar/Navbar.css
src/assets/gallery/README.md
src/assets/gallery/*.webp (17 lightbox images)
src/assets/gallery/thumbnails/*.webp (34 responsive thumbnails)
```

Modified:

```text
src/App.tsx
src/Component/navbar/Navbar.tsx
src/pages/landing-page/landing-page.tsx
```

The pre-existing `package.json` and `package-lock.json` changes are preserved.
No backend, authentication, or registration form code was changed.

## Verification

Run from `frontend/`:

```text
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npm run build
npm run lint
```

The existing build script runs `tsc` against a solution configuration, so the
explicit project checks above are also necessary to check application code.

Manually check day tabs (click, arrow keys, Home/End), combined resource search
and category filters, filter resets, and all section links at mobile, tablet,
and desktop widths. Once official assets are supplied, verify every document
target and photo-stack navigation, caption synchronization, touch swipes, the full
gallery overview, enlarged photographs, Escape, focus restoration, and image
failure handling. The overview and lightbox use native modal dialogs for focus
containment and lock page scrolling while open. Reduced-motion settings disable
the new section animations.

### Implementation check results

- Application and Vite configuration TypeScript checks pass.
- Production build passes.
- Lint passes for all created and modified application files.
- Full-project lint reports an existing error at
  `src/pages/registration/RegistrationPage.tsx:23` (`react-hooks/set-state-in-effect`)
  and a missing effect dependency warning at line 25. That file is unchanged.
- 18 current gallery interaction checks pass with the actual 17-image dataset:
  stack navigation, synchronized captions, arrow/Home/End keys, vertical swipes,
  full-gallery browsing, enlarged-photo navigation, nested dialog cleanup, focus
  restoration, image errors, and one/two/zero-photo collection handling.
- 19 interactive schedule checks pass: horizontal day tabs, keyboard navigation,
  ARIA references, category filters and counts, individual and bulk disclosure
  controls, per-day expansion state, empty-filter reset, the single TBA notice,
  confirmed/partially unconfirmed details, and empty programmes.
- All 51 WebP assets decode, have matching paths/dimensions, and preserve source
  proportions within pixel rounding. The Vite build manifest confirms that all
  51 imported images are emitted with fingerprinted filenames, byte-identical
  to their source assets. The old public/gallery directory and root URLs are gone.
  All 17 original source file hashes remain unchanged. An optimized-image contact
  sheet was inspected for orientation and framing; live browser visual QA remains
  unavailable.
- Browser visual QA was unavailable: the browser connector was unavailable and
  Windows Computer Use stopped because it could not reliably determine the URL.
  Responsive appearance and native dialog focus containment still need browser QA.
- No project dependencies were added. Temporary test tooling was isolated under
  ignored `node_modules` and does not change the project's dependency manifests.
