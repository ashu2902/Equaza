import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { getAdminFirestore } from './server-app';
import type { PageType } from '@/types';

// --- Static Build Configuration ---
const IS_STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_BUILD === 'true';
const STATIC_DATA_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'static-data.json'
);

// --- Static Image Map Configuration ---
const STATIC_IMAGE_MAP_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'static-image-map.json'
);

// Type for the static image map
type StaticImageMap = Record<string, string>;

/**
 * Reads the entire static data file.
 */
async function getStaticData() {
  if (!IS_STATIC_BUILD) return null;
  try {
    const fileContent = await fs.readFile(STATIC_DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read static data file:', error);
    return null;
  }
}

/**
 * Reads the static image map generated during the build process.
 * Returns an empty object if the file does not exist (e.g., in dev mode or if prebuild failed).
 */
async function getStaticImageMap(): Promise<StaticImageMap> {
  try {
    const fileContent = await fs.readFile(STATIC_IMAGE_MAP_PATH, 'utf-8');
    return JSON.parse(fileContent) as StaticImageMap;
  } catch (error) {
    // This is expected in development or if the prebuild script hasn't run
    // console.warn('Could not read static image map:', error);
    return {};
  }
}

export interface HeroSlide {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt: string; staticSrc?: string };
}

export interface HomePageData {
  hero?: HeroSlide[]; // New: list of slides
  features?: { icon: string; label: string }[];
  styles?: {
    name: string;
    image: { src: string; alt: string };
    href: string;
    sortOrder?: number;
  }[];
  roomHighlight?: {
    title: string;
    description: string;
    cta: { label: string; href: string };
    image: { src: string; alt: string; staticSrc?: string };
  };
  techniques?: {
    title: string;
    image: { src: string; alt: string; staticSrc?: string };
    href?: string;
  }[];
  primaryCta?: { headline: string; label: string; href: string };
  story?: { title: string; body: string; ctaLabel: string; href: string };
  craftsmanship?: {
    title: string;
    cta: { label: string; href: string };
    image: { src: string; alt: string; staticSrc?: string };
  };
  lookbook?: {
    thumbnail: { src: string; alt: string; staticSrc?: string };
    pdfStorageRef: string;
    caption?: string;
  };
  contact?: { heading: string; subcopy?: string };
  isActive?: boolean;
  updatedAt?: any;
}

export async function getHomePageData(): Promise<HomePageData | null> {
  let data: HomePageData | null = null;

  try {
    if (IS_STATIC_BUILD) {
      const staticData = await getStaticData();
      data = staticData?.homePageData as HomePageData | null;
    } else {
      const db = getAdminFirestore();
      const docRef = db.collection('pages').doc('home');
      const doc = await docRef.get();
      if (!doc.exists) return null;
      data = doc.data() as HomePageData;
    }

    if (!data) return null;

    // Merge static image paths if available (only runs during build/server-side)
    const staticMap = await getStaticImageMap();

    // 1. Hero Section (First Slide)
    if (data.hero && Array.isArray(data.hero) && data.hero.length > 0) {
      const slide = data.hero[0];
      const staticSrc = staticMap['homepage-hero'];
      if (staticSrc && slide?.image) {
        data.hero[0] = {
          ...slide,
          image: { ...slide.image, staticSrc },
        };
      }
    }

    // 2. Room Highlight Section
    if (data.roomHighlight && data.roomHighlight.image) {
      const staticSrc = staticMap['room-highlight'];
      if (staticSrc) {
        data.roomHighlight.image.staticSrc = staticSrc;
      }
    }

    // 3. Techniques/Weave Types Section (assuming techniques[0] maps to weave-type-1)
    if (data.techniques && data.techniques.length > 0) {
      data.techniques = data.techniques.map((technique, index) => {
        const staticSrc = staticMap[`weave-type-${index + 1}`];
        if (staticSrc && technique.image) {
          return {
            ...technique,
            image: { ...technique.image, staticSrc },
          };
        }
        return technique;
      });
    }

    // 4. Craftsmanship Section
    if (data.craftsmanship && data.craftsmanship.image) {
      const staticSrc = staticMap['craftsmanship-image'];
      if (staticSrc) {
        data.craftsmanship.image.staticSrc = staticSrc;
      }
    }

    // 5. Lookbook Thumbnail
    if (data.lookbook && data.lookbook.thumbnail) {
      const staticSrc = staticMap['lookbook-thumbnail'];
      if (staticSrc) {
        data.lookbook.thumbnail.staticSrc = staticSrc;
      }
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch pages/home:', error);
    return null;
  }
}

/**
 * Update Home Page Data (admin-only; call via server action)
 */
export async function setHomePageData(
  data: Partial<HomePageData>
): Promise<void> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection('pages').doc('home');
    await docRef.set({ ...data, updatedAt: new Date() }, { merge: true });
  } catch (error) {
    console.error('Failed to update pages/home:', error);
    throw new Error('Failed to update homepage content');
  }
}

/**
 * Update Content Page Data by type (admin-only; call via server action)
 */
export async function setContentPageData(
  pageType: PageType,
  data: Record<string, any>
): Promise<void> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection('pages').doc(pageType);
    await docRef.set({ ...data, updatedAt: new Date() }, { merge: true });
  } catch (error) {
    console.error(`Failed to update pages/${pageType}:`, error);
    throw new Error('Failed to update content page');
  }
}
