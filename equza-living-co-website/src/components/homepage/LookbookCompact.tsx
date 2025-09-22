import Image from 'next/image';
import Link from 'next/link';

interface LookbookCompactProps {
  thumbnail?: { src?: string; alt?: string } | null;
  caption?: string | null;
  pdfUrl?: string | null;
}

export function LookbookCompact({ thumbnail, caption, pdfUrl }: LookbookCompactProps) {
  const href = pdfUrl || '#';
  const disabled = !pdfUrl;
  return (
    <section aria-label="Lookbook">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-neutral-200 bg-white/80 p-6">
          <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-lg">
            {thumbnail?.src ? (
              <Image src={thumbnail.src} alt={thumbnail.alt || 'Lookbook'} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-2">Latest Lookbook</h2>
            <p className="text-neutral-700 mb-4">{caption || 'A curated visual tour into our world — textures, palettes, and spaces that breathe.'}</p>
            <Link
              href={href}
              target="_blank"
              rel="noopener"
              className="inline-block px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-[#98342d] text-white hover:bg-[#8a2e26] hover:shadow-md"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


