// Helper functions for the application

/**
 * Fetches an image as a blob to bypass CORS issues and creates an object URL
 * @param {string} imageUrl - The original image URL
 * @returns {Promise<string>} - Object URL for the image blob
 */
export const fetchImageAsBlob = async (imageUrl) => {
  try {
    const imageResponse = await fetch(imageUrl);
    if (imageResponse.ok) {
      const blob = await imageResponse.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch image:`, error);
    return null;
  }
};

/**
 * Cleans up object URLs to prevent memory leaks
 * @param {Object} imageUrls - Object containing image URLs
 */
export const cleanupImageUrls = (imageUrls) => {
  Object.values(imageUrls).forEach((url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};
