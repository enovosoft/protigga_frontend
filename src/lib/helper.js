import { formatDistanceToNow } from "date-fns";

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

export const getRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(price);
};

export const truncateText = (text, maxLength = 200) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
