import type { Resource } from './types';

/** Only expose published files with local/root-relative or HTTP(S) URLs. */
export function getResourceFileUrl(resource: Resource): string | null {
  if (!resource.available) return null;
  const url = resource.fileUrl.trim();
  return /^(https?:\/\/|\/(?!\/)|\.\.?\/)/i.test(url) ? url : null;
}
