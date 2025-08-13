# Equza Living Co. Website Platform

## 🏠 About

Equza Living Co. is a premium handcrafted rug company platform built with modern web technologies. This Next.js application showcases artisan-made rugs with a focus on crafted calm for modern spaces.

## ✨ Features

- **🎨 Premium Design**: Modern, elegant interface showcasing handcrafted rugs
- **📱 Responsive**: Optimized for desktop, tablet, and mobile devices
- **🔥 Firebase Integration**: Real-time database, authentication, and storage
- **📧 Lead Management**: Anonymous form submissions for contact, customization, and trade inquiries
- **🎯 SEO Optimized**: Server-side rendering and metadata management
- **⚡ Performance**: Optimized images, code splitting, and fast loading
- **🛡️ Security**: Input validation, rate limiting, and secure data handling
- **♿ Accessible**: WCAG 2.1 AA compliance with proper aria labels and keyboard navigation

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended) or Firebase Hosting

## 📋 Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn
- Firebase account
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd equza-living-co-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   # See ../setup/ENVIRONMENT_SETUP.md for detailed instructions
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore, Authentication, and Storage
   - Copy your config values to `.env.local`
   - Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin panel routes
│   ├── collections/       # Collection pages
│   ├── product/           # Product detail pages
│   ├── spaces/            # Space-based pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── product/          # Product-related components
│   └── collections/      # Collection components
├── lib/                  # Utility functions
│   ├── firebase/         # Firebase configuration
│   ├── utils/            # Helper utilities
│   └── hooks/            # Custom React hooks
└── types/                # TypeScript definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run check-all` - Run all checks (type, lint, format)

## 🌍 Environment Variables

See `../setup/ENVIRONMENT_SETUP.md` for detailed environment configuration instructions.

### Required Variables
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `NEXT_PUBLIC_CONTACT_EMAIL` - Contact email
- `NEXT_PUBLIC_CONTACT_PHONE` - Contact phone
- `NEXT_PUBLIC_SITE_URL` - Site URL

### Optional Variables
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager
- `CALENDLY_API_TOKEN` - Calendly integration
- `RESEND_API_KEY` - Email service
- Social media links

## 🎨 Design System

The project uses a comprehensive design system built with Tailwind CSS:

- **Colors**: Brand-specific color palette
- **Typography**: Poppins (sans-serif) and Libre Baskerville (serif)
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach

## 📊 Data Model

### Collections
- Style collections (Botanica, Avant, Graphika, Heirloom, Lumière, Terra)
- Space collections (Living Room, Bedroom, Hallway)

### Products
- Detailed specifications (materials, weave type, sizes)
- High-resolution image galleries
- Stories behind each rug
- Room type associations

### Leads
- Contact form submissions
- Customization requests
- Product enquiries
- Trade partnership applications

## 🔒 Security Features

- **Firebase Security Rules**: Public read, admin-only write
- **Input Validation**: Zod schemas for all forms
- **Rate Limiting**: Prevents spam submissions
- **CSRF Protection**: Secure form handling
- **XSS Prevention**: Input sanitization

## 📈 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Bundle Optimization**: Firebase chunk separation
- **Caching**: Server-side caching for data fetching
- **CDN**: Firebase Storage for global asset delivery

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast ratios
- Semantic HTML structure
- ARIA labels and roles

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Firebase Hosting
1. Build the project: `npm run build`
2. Deploy: `firebase deploy`

## 🧪 Testing

- Unit tests with Jest and React Testing Library
- Integration tests for form submissions
- Accessibility testing with automated tools
- Performance testing with Lighthouse

## 📚 Documentation

- `../setup/ENVIRONMENT_SETUP.md` - Environment configuration guide
- `docs/` - Detailed project documentation
- Component documentation in respective files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary to Equza Living Co.

## 🆘 Support

For technical support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Equza Living Co.**

