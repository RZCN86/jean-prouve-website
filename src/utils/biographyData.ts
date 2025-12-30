import { BiographyContent, TimelineEvent, ImageData } from '@/types';
import { biographyContent, timelineEvents, biographyImages } from '@/data/biography';

/**
 * Biography data loading and management utilities
 */

// Cache for loaded data
let cachedBiographyData: BiographyContent | null = null;
let cachedTimelineData: TimelineEvent[] | null = null;
let cachedImageData: ImageData[] | null = null;

/**
 * Load biography content data
 * @returns Promise<BiographyContent>
 */
export async function loadBiographyContent(): Promise<BiographyContent> {
  if (cachedBiographyData) {
    return cachedBiographyData;
  }

  try {
    // In a real application, this might fetch from an API or CMS
    // For now, we return the static data
    cachedBiographyData = biographyContent;
    return cachedBiographyData;
  } catch (error) {
    // Log error in development, but don't expose in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading biography content:', error);
    }
    throw new Error('Failed to load biography content');
  }
}

/**
 * Load timeline events data
 * @returns Promise<TimelineEvent[]>
 */
export async function loadTimelineEvents(): Promise<TimelineEvent[]> {
  if (cachedTimelineData) {
    return cachedTimelineData;
  }

  try {
    // Sort events by year
    const sortedEvents = [...timelineEvents].sort((a, b) => a.year - b.year);
    cachedTimelineData = sortedEvents;
    return cachedTimelineData;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading timeline events:', error);
    }
    throw new Error('Failed to load timeline events');
  }
}

/**
 * Load biography images data
 * @returns Promise<ImageData[]>
 */
export async function loadBiographyImages(): Promise<ImageData[]> {
  if (cachedImageData) {
    return cachedImageData;
  }

  try {
    cachedImageData = biographyImages;
    return cachedImageData;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading biography images:', error);
    }
    throw new Error('Failed to load biography images');
  }
}

/**
 * Get timeline events by category
 * @param category - The category to filter by
 * @returns Promise<TimelineEvent[]>
 */
export async function getTimelineEventsByCategory(
  category: TimelineEvent['category']
): Promise<TimelineEvent[]> {
  const events = await loadTimelineEvents();
  return events.filter(event => event.category === category);
}

/**
 * Get timeline events by year range
 * @param startYear - Start year (inclusive)
 * @param endYear - End year (inclusive)
 * @returns Promise<TimelineEvent[]>
 */
export async function getTimelineEventsByYearRange(
  startYear: number,
  endYear: number
): Promise<TimelineEvent[]> {
  const events = await loadTimelineEvents();
  return events.filter(event => event.year >= startYear && event.year <= endYear);
}

/**
 * Get biography image by ID
 * @param imageId - The image ID to find
 * @returns Promise<ImageData | null>
 */
export async function getBiographyImageById(imageId: string): Promise<ImageData | null> {
  const images = await loadBiographyImages();
  return images.find(image => image.id === imageId) || null;
}

/**
 * Get all biography data at once
 * @returns Promise<{content: BiographyContent, timeline: TimelineEvent[], images: ImageData[]}>
 */
export async function loadAllBiographyData(): Promise<{
  content: BiographyContent;
  timeline: TimelineEvent[];
  images: ImageData[];
}> {
  try {
    const [content, timeline, images] = await Promise.all([
      loadBiographyContent(),
      loadTimelineEvents(),
      loadBiographyImages()
    ]);

    return { content, timeline, images };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading all biography data:', error);
    }
    throw new Error('Failed to load biography data');
  }
}

/**
 * Clear cached data (useful for testing or data refresh)
 */
export function clearBiographyCache(): void {
  cachedBiographyData = null;
  cachedTimelineData = null;
  cachedImageData = null;
}

/**
 * Validate biography content structure
 * @param content - The content to validate
 * @returns boolean
 */
export function validateBiographyContent(content: any): content is BiographyContent {
  return (
    content &&
    typeof content === 'object' &&
    content.personalInfo &&
    typeof content.personalInfo.fullName === 'string' &&
    Array.isArray(content.education) &&
    Array.isArray(content.career) &&
    Array.isArray(content.philosophy) &&
    Array.isArray(content.collaborations) &&
    Array.isArray(content.legacy)
  );
}

/**
 * Validate timeline event structure
 * @param event - The event to validate
 * @returns boolean
 */
export function validateTimelineEvent(event: any): event is TimelineEvent {
  return (
    event &&
    typeof event === 'object' &&
    typeof event.year === 'number' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    ['education', 'career', 'achievement', 'collaboration'].includes(event.category)
  );
}

/**
 * Validate image data structure
 * @param image - The image to validate
 * @returns boolean
 */
export function validateImageData(image: any): image is ImageData {
  return (
    image &&
    typeof image === 'object' &&
    typeof image.id === 'string' &&
    typeof image.src === 'string' &&
    typeof image.alt === 'string' &&
    typeof image.width === 'number' &&
    typeof image.height === 'number'
  );
}