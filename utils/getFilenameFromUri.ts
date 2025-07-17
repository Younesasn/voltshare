export function getFilenameFromUri(uri: string): string {
  return uri.split("/").pop() || `image_${Date.now()}.jpg`;
}
