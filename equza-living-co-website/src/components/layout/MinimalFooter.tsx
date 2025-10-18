const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/equzalivingco/',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/equza-living-co/',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/equzaliving/',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.956 1.404-5.956s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/EquzaLivingCo',
    icon: (
      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
    ),
  },
];

export function MinimalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-12' style={{ backgroundColor: '#d4b896' }}>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        {/* Company Branding */}
        <div className='mb-6'>
          <h3
            className='text-2xl font-bold text-gray-900 mb-2'
            style={{ fontFamily: 'Poppins' }}
          >
            EQUZA LIVING CO.
          </h3>
          <p
            className='text-gray-700 text-sm'
            style={{ fontFamily: 'Poppins' }}
          >
            Exporting luxury from India | Artisan-made for modern homes
          </p>
        </div>

        {/* Contact Details */}
        <div className='mb-6'>
          <div
            className='flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm text-gray-700'
            style={{ fontFamily: 'Poppins' }}
          >
            <a
              href='mailto:parth@equzaliving.com'
              className='hover:text-gray-900 transition-colors'
            >
              parth@equzaliving.com
            </a>
            <span className='hidden sm:inline'>|</span>
            <a
              href='tel:+919172652528'
              className='hover:text-gray-900 transition-colors'
            >
              +91 9172652528
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className='mb-6'>
          <div className='flex justify-center space-x-4'>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-700 hover:text-gray-900 transition-colors duration-200'
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div
          className='text-xs text-gray-600'
          style={{ fontFamily: 'Poppins' }}
        >
          © {currentYear} Equza Concepts Private Limited
        </div>
      </div>
    </footer>
  );
}
