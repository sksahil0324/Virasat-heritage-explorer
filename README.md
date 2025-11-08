# VIRASAT - Virtual Heritage Exploration Platform

[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange)](https://convex.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS4-cyan)](https://tailwindcss.com/)

> **Experience India's Cultural Heritage in Immersive Digital Reality**

VIRASAT is an innovative web platform that brings India's rich cultural heritage to life through cutting-edge technology. Explore ancient monuments, historical sites, and cultural treasures through interactive 3D models, 360° panoramic tours, and multilingual audio guides.

## ✨ Features

### 🏛️ Immersive Exploration
- **360° Panoramic Views** - Virtual tours that let you explore heritage sites from every angle
- **Interactive 3D Models** - Detailed 3D representations of monuments and structures
- **High-Quality Media Gallery** - Professional photographs and videos

### 🎧 Multilingual Experience
- **Audio Guides** - Available in 8+ languages (English, Hindi, Spanish, French, German, Japanese, Chinese, Arabic)
- **Play Tracking** - Monitor engagement with audio content
- **Admin Management** - Easy upload and management of audio files

### 🔍 Smart Discovery
- **Interactive Maps** - Discover sites by location with integrated mapping
- **Advanced Filtering** - Browse by category, UNESCO status, state, and more
- **Powerful Search** - Find heritage sites by name, location, or category

### 📚 Rich Content Library
- **Historical Documentation** - Detailed information and significance
- **Cultural Insights** - Folk tales, cuisine, and community stories
- **Visitor Information** - Hours, tickets, guidelines, and best times to visit

### 👥 Community Engagement
- **User Stories** - Share and read personal experiences
- **Content Moderation** - Admin-reviewed community contributions
- **Favorites System** - Save and organize preferred sites

### ⚡ Admin Dashboard
- **Complete Site Management** - Full CRUD operations for heritage sites
- **Media Management** - Upload, organize, and set primary images
- **Audio Management** - Handle multilingual audio guides
- **Content Moderation** - Review user submissions
- **Analytics** - Track site statistics and user engagement

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Convex account for backend

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd virasat

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your Convex deployment URL and Unsplash API key

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Setup

Create a `.env.local` file with:

```env
VITE_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOYMENT=your_deployment_id
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI framework with latest features
- **Vite** - Fast build tool and development server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn UI** - High-quality component library
- **Framer Motion** - Smooth animations and transitions
- **Three.js** - 3D graphics and model rendering
- **Lucide Icons** - Beautiful icon library

### Backend
- **Convex** - Real-time database and backend functions
- **Convex Auth** - Email OTP authentication
- **Node.js** - Server-side runtime for actions

### Integrations
- **Unsplash API** - Access to millions of high-quality photos

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── AudioGuideSection.tsx
│   ├── Model3DViewer.tsx
│   ├── PanoramaViewer.tsx
│   └── ...
├── convex/              # Backend functions and schema
│   ├── schema.ts
│   ├── heritageSites.ts
│   ├── audio.ts
│   └── ...
├── pages/               # Application pages
│   ├── Landing.tsx
│   ├── Explore.tsx
│   ├── SiteDetail.tsx
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── index.css           # Global styles and theme
```

## 🎯 Core Pages

### 🏠 Landing Page (`/`)
- Hero section with rotating heritage site showcase
- Feature highlights with interactive holographic cards
- Call-to-action for exploration
- Animated particle background effects

### 🔐 Authentication (`/auth`)
- Secure email OTP verification
- Seamless login/registration flow
- Automatic redirect to user dashboard

### 🌍 Explore (`/explore`)
- Comprehensive site browsing
- Advanced filtering and search
- Interactive map integration
- Responsive site cards with key information

### 📖 Site Details (`/site/:id`)
- Complete site information and history
- Interactive 360° panoramic viewer
- 3D model exploration
- Multilingual audio guides
- Photo galleries and visitor info
- Community stories and favorites

### ⭐ Favorites (`/favorites`)
- Personalized collection of saved sites
- Quick access to preferred locations
- Easy management of saved content

### 👨‍💼 Admin Dashboard (`/admin`)
- Comprehensive content management
- Media and audio file handling
- User story moderation
- Analytics and statistics

## 🗃️ Database Schema

### Core Collections
- **users** - User profiles and authentication data
- **heritageSites** - Complete heritage site information
- **media** - Images, videos, 3D models, and panoramas
- **audioSummaries** - Multilingual audio guide content
- **favorites** - User favorite site relationships
- **userStories** - Community-submitted stories and experiences

## 🎨 Design System

VIRASAT features a modern, immersive design with:

- **Glass Morphism** - Frosted glass effects for UI depth
- **Gradient Text** - Eye-catching typography treatments
- **Particle Animations** - Dynamic background elements
- **Holographic Cards** - Shimmering, interactive components
- **Smooth Transitions** - Fluid animations throughout
- **Theme Support** - Full dark/light mode compatibility

## ⚡ Performance

- Real-time data synchronization with Convex
- Lazy loading for images and media content
- Optimized 3D model rendering
- Efficient pagination and data fetching
- Code splitting with dynamic imports

## 🔮 Roadmap

### Planned Enhancements
- [ ] Virtual Reality (VR) support for immersive experiences
- [ ] Augmented Reality (AR) features for on-site exploration
- [ ] Multi-language UI support
- [ ] Advanced analytics dashboard
- [ ] Social sharing capabilities
- [ ] Guided tour collections
- [ ] Mobile application

## 🤝 Contributing

We welcome contributions from the community! Please feel free to submit issues, feature requests, or pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the VIRASAT Platform License.

## 🆘 Support

- **Documentation**: [Link to documentation]
- **Issues**: [GitHub Issues]
- **Email**: support@virasat.com

---

<div align="center">

**VIRASAT** - *Preserving Heritage Through Technology*

*Experience India's cultural legacy like never before*

</div>
