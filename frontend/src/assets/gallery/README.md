# LIT-MUN gallery photographs

These 17 event photographs were supplied by the project owner. Original JPGs
remain outside the repository and are unchanged. No stock images are included.

Each image has a full-size WebP (maximum 2400 px on its longest edge, quality 85)
and 480 px / 960 px wide WebP thumbnails (quality 79), preserving aspect ratios.
Orientation is normalized and embedded metadata is omitted from the web copies.

Captions, categories, alt text, and dimensions are in
`src/Component/gallery/galleryData.ts`. No names, specific award titles, or
event dates were inferred.

This folder is `frontend/src/assets/gallery/`; smaller versions are in its
`thumbnails/` subfolder. All 51 WebPs are explicitly imported by `galleryData.ts`.
Use those imports in photo records instead of hardcoded `/gallery/...` URLs.
Vite emits fingerprinted files under the build's assets directory and updates
the imported URLs automatically. No gallery copies remain under `public/`.

| Source photograph | WebP filename |
| --- | --- |
| IMG_5355-Enhanced-NR.jpg | conference-group-portrait-01.webp |
| IMG_5160-Enhanced-NR.jpg | committee-delegate-laptop-01.webp |
| IMG_4957.jpg | committee-raised-note-01.webp |
| IMG_5353-Enhanced-NR.jpg | conference-group-portrait-02.webp |
| IMG_4997-Enhanced-NR.jpg | committee-delegate-speaking-01.webp |
| IMG_5056.jpg | committee-raised-placard-01.webp |
| IMG_4981.jpg | committee-note-taking-02.webp |
| IMG_5343.jpg | conference-auditorium-01.webp |
| IMG_4970-Enhanced-NR.jpg | committee-discussion-01.webp |
| IMG_5045.jpg | committee-note-taking-01.webp |
| IMG_5230-Enhanced-NR.jpg | awards-memento-bouquet-01.webp |
| IMG_5310.jpg | awards-certificate-01.webp |
| IMG_5314.jpg | awards-medal-certificate-01.webp |
| IMG_5288.jpg | awards-medal-certificate-02.webp |
| IMG_5293.jpg | awards-medal-certificate-03.webp |
| IMG_5249.jpg | awards-appreciation-01.webp |
| IMG_5238.jpg | awards-appreciation-02.webp |
