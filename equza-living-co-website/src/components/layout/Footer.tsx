import Link from 'next/link';

const footerLinks = {
  explore: [
    { label: 'Collections', href: '/collections' },
    { label: 'Rugs by Style', href: '/collections?tab=style' },
    { label: 'Rugs by Space', href: '/collections?tab=space' },
    { label: 'Custom Rugs', href: '/customize' },
  ],
  company: [
    { label: 'Our Story', href: '/our-story' },
    { label: 'Craftsmanship', href: '/craftsmanship' },
    { label: 'Trade Partners', href: '/trade' },
    { label: 'Contact Us', href: '#contact' },
  ],
  resources: [
    { label: 'Lookbook', href: '/assets/lookbook.pdf', external: true },
    { label: 'Care Guide', href: '/care-guide' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping Info', href: '/shipping' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/equzalivingco',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm5.524 7.384c.006.121.009.242.009.364 0 3.71-2.825 7.991-7.991 7.991A7.946 7.946 0 014.195 14.54c.23.027.464.041.702.041a5.62 5.62 0 003.473-1.196 2.807 2.807 0 01-2.62-1.947c.18.034.364.053.554.053.268 0 .527-.036.773-.103a2.804 2.804 0 01-2.248-2.749v-.035c.83.461 1.779.738 2.787.77a2.804 2.804 0 01-.867-3.744 7.96 7.96 0 005.775 2.927 2.804 2.804 0 014.776-2.556 5.618 5.618 0 001.779-.678 2.817 2.817 0 01-1.233 1.552 5.612 5.612 0 001.608-.441 5.892 5.892 0 01-1.396 1.454z' />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/equzalivingco',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.956 1.404-5.956s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/equzalivingco',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-warm-900 text-cream-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16'>
        {/* Main footer content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand section */}
          <div className='lg:col-span-1'>
            <div className='flex items-center mb-4'>
              <div className='w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center mr-3'>
                <span className='text-cream-50 font-bold text-sm'>E</span>
              </div>
              <span className='font-baskerville text-xl text-primary-800 tracking-wide'>
                Equza Living Co.
              </span>
            </div>
            <p className='text-cream-300 text-sm leading-relaxed mb-6'>
              Handcrafted rugs that bring crafted calm to modern spaces.
              Discover heritage weaving traditions reimagined for contemporary
              living.
            </p>

            {/* Social links */}
            <div className='flex space-x-4'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-cream-400 hover:text-cream-50 transition-colors duration-200'
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className='text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4'>
              Explore
            </h3>
            <ul className='space-y-3'>
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-cream-300 hover:text-cream-50 transition-colors duration-200 text-sm'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4'>
              Company
            </h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('#') ? (
                    <button
                      onClick={() => {
                        const element = document.getElementById(
                          link.href.slice(1)
                        );
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className='text-cream-300 hover:text-cream-50 transition-colors duration-200 text-sm text-left'
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className='text-cream-300 hover:text-cream-50 transition-colors duration-200 text-sm'
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4'>
              Resources
            </h3>
            <ul className='space-y-3'>
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-cream-300 hover:text-cream-50 transition-colors duration-200 text-sm'
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className='text-cream-300 hover:text-cream-50 transition-colors duration-200 text-sm'
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className='border-t border-warm-800 mt-12 pt-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div className='mb-6 lg:mb-0'>
              <h3 className='text-lg font-medium text-cream-50 mb-2'>
                Stay in the loop
              </h3>
              <p className='text-cream-300 text-sm'>
                Get updates on new collections and design inspiration.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 lg:max-w-md'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-2 bg-warm-800 border border-warm-700 rounded-md text-cream-50 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'
              />
              <button className='px-6 py-2 bg-primary-600 text-cream-50 rounded-md hover:bg-primary-700 transition-colors duration-200 font-medium whitespace-nowrap'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-warm-800 mt-8 pt-8 flex flex-col md:flex-row md:items-center md:justify-between'>
          <div className='text-cream-400 text-sm mb-4 md:mb-0'>
            © {currentYear} Equza Living Co. All rights reserved.
          </div>

          <div className='flex flex-wrap gap-6 text-sm'>
            <Link
              href='/privacy'
              className='text-cream-400 hover:text-cream-50 transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-cream-400 hover:text-cream-50 transition-colors'
            >
              Terms of Service
            </Link>
            <Link
              href='/shipping'
              className='text-cream-400 hover:text-cream-50 transition-colors'
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
