import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { PageType } from '@/types';

export interface HomePageData {
  hero?: { title: string; cta?: { label: string; href: string }; image: { src: string; alt: string } };
  features?: { icon: string; label: string }[];
  styles?: { name: string; image: { src: string; alt: string }; href: string; sortOrder?: number }[];
  roomHighlight?: { title: string; description: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  techniques?: { title: string; image: { src: string; alt: string }; href?: string }[];
  primaryCta?: { headline: string; label: string; href: string };
  story?: { title: string; body: string; ctaLabel: string; href: string };
  craftsmanship?: { title: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  lookbook?: { thumbnail: { src: string; alt: string }; pdfStorageRef: string; caption?: string };
  contact?: { heading: string; subcopy?: string };
  isActive?: boolean;
  updatedAt?: any;
}

export async function getHomePageData(): Promise<HomePageData | null> {
  try {
    const ref = doc(collection(db, 'pages'), 'home');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as HomePageData;
    return data || null;
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
    const ref = doc(collection(db, 'pages'), 'home');
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
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
    const ref = doc(collection(db, 'pages'), pageType);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error(`Failed to update pages/${pageType}:`, error);
    throw new Error('Failed to update content page');
  }
}


