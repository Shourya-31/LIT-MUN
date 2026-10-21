export interface GalleryImage {
  id: string;
  /** Full-size web image. Only use photographs approved for the LIT-MUN gallery. */
  src: string;
  thumbnailSrc?: string;
  thumbnailSrcSet?: string;
  alt: string;
  caption?: string;
  category?: string;
  year?: number;
  /** Intrinsic image dimensions reserve space while the image loads. */
  width: number;
  height: number;
}

export interface GalleryProps {
  images?: readonly GalleryImage[];
}
