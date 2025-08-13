import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './config';

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


