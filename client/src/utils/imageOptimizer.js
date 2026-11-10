/**
 * Auto-Optimize & Compress Images via Cloudinary URLs
 * Enables automatic format selection (f_auto), intelligent quality compression (q_auto),
 * and width capping to reduce payload sizes and eliminate bandwidth bottlenecks.
 */

export const IMAGE_PRESETS = {
  THUMBNAIL: 300,
  CARD: 600,
  HERO: 1200,
};

/**
 * Transforms a Cloudinary image URL to include f_auto, q_auto, and a target width.
 * Returns the original URL if null or non-Cloudinary.
 *
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels (defaults to 800)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url || '';
  }

  // If the URL already contains transformation params, replace/update width cleanly
  if (url.includes('/upload/f_auto,q_auto')) {
    return url.replace(/w_\d+/, `w_${width}`);
  }

  // Transform .../upload/... into .../upload/f_auto,q_auto,w_<width>,c_limit/...
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

export const getThumbnailUrl = (url) => getOptimizedImageUrl(url, IMAGE_PRESETS.THUMBNAIL);
export const getCardImageUrl = (url) => getOptimizedImageUrl(url, IMAGE_PRESETS.CARD);
export const getHeroImageUrl = (url) => getOptimizedImageUrl(url, IMAGE_PRESETS.HERO);

export default getOptimizedImageUrl;
