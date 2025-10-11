
const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/equzalivingco/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }
];

export function MinimalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12" style={{backgroundColor: '#d4b896'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Company Branding */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Poppins'}}>
            EQUZA LIVING CO.
          </h3>
          <p className="text-gray-700 text-sm" style={{fontFamily: 'Poppins'}}>
            Exporting luxury from India | Artisan-made for modern homes
          </p>
        </div>

        {/* Contact Details */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm text-gray-700" style={{fontFamily: 'Poppins'}}>
            <a 
              href="mailto:parth@equzaliving.com" 
              className="hover:text-gray-900 transition-colors"
            >
              parth@equzaliving.com
            </a>
            <span className="hidden sm:inline">|</span>
            <a 
              href="tel:+919172652528" 
              className="hover:text-gray-900 transition-colors"
            >
              +91 9172652528
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-600" style={{fontFamily: 'Poppins'}}>
          © {currentYear} Equza Living Co.
        </div>
      </div>
    </footer>
  );
}
