import JSZip from "jszip";

export async function downloadSourceCode() {
  const zip = new JSZip();

  try {
    // Create a comprehensive README with project information
    const readmeContent = `
VIRASAT - Heritage Explorer Source Code
========================================

This project is built with React, TypeScript, Vite, and Convex.

PROJECT STRUCTURE:
==================

Frontend (React + TypeScript):
- src/pages/           - Main application pages
  - Landing.tsx        - Landing page with hero section
  - Explore.tsx        - Heritage sites exploration page
  - SiteDetail.tsx     - Individual site details
  - AdminDashboard.tsx - Admin management interface
  - Auth.tsx           - Authentication page
  - Favorites.tsx      - User favorites page
  - NotFound.tsx       - 404 page

- src/components/      - Reusable React components
  - ParticleBackground.tsx
  - HolographicCard.tsx
  - FloatingElement.tsx
  - AnimatedSection.tsx
  - InteractiveMap.tsx
  - LogoDropdown.tsx
  - ui/                - Shadcn UI components

Backend (Convex):
- src/convex/
  - schema.ts          - Database schema definitions
  - heritageSites.ts   - Heritage sites CRUD operations
  - media.ts           - Media upload and management
  - audio.ts           - Audio guide management
  - favorites.ts       - User favorites functionality
  - users.ts           - User management
  - auth.ts            - Authentication configuration
  - makeAdmin.ts       - Admin role assignment
  - seedData.ts        - Initial data seeding

Utilities & Hooks:
- src/lib/
  - utils.ts           - Utility functions
  - downloadSource.ts  - Source code download utility

- src/hooks/
  - use-auth.ts        - Authentication hook
  - use-mobile.ts      - Mobile detection hook

Styles:
- src/index.css        - Global styles and Tailwind configuration

Configuration:
- package.json         - Dependencies and scripts
- vite.config.ts       - Vite configuration
- tsconfig.json        - TypeScript configuration
- components.json      - Shadcn UI configuration

SETUP INSTRUCTIONS:
===================

1. Install dependencies:
   pnpm install

2. Set up Convex:
   npx convex dev

3. Start the development server:
   pnpm dev

4. Build for production:
   pnpm build

KEY FEATURES:
=============
- Interactive heritage site exploration
- 3D models and 360° panoramic views
- Audio guides in multiple languages
- Interactive maps with geolocation
- Admin dashboard for content management
- User authentication and favorites
- Responsive design with futuristic theme

TECHNOLOGIES:
=============
- React 19 with TypeScript
- Vite for build tooling
- Convex for backend and database
- Tailwind CSS for styling
- Shadcn UI component library
- Framer Motion for animations
- Leaflet for interactive maps
- React Router for navigation

ACCESSING THE SOURCE CODE:
==========================

Since this is a web application, the source code is not directly downloadable
from the browser. To access the complete source code:

1. If you have access to the repository:
   - Clone from GitHub/GitLab
   - Or download from the version control system

2. If you're running this locally:
   - The source code is in your project directory
   - All files are in the 'src/' folder

3. Contact the project administrator for repository access

FILE COUNT:
===========
- Pages: 7 main pages
- Components: 50+ UI components
- Convex Functions: 15+ backend functions
- Total TypeScript files: 85+

Downloaded on: ${new Date().toLocaleString()}

For more information, see the project README.md
`;

    zip.file("VIRASAT_PROJECT_INFO.txt", readmeContent);

    // Add package.json content as text
    const packageInfo = `
VIRASAT - Package Dependencies
================================

This file lists all the dependencies used in the VIRASAT project.

Main Dependencies:
- React 19.1.0
- Convex 1.27.0
- TypeScript 5.8.3
- Vite 6.3.5
- Tailwind CSS 4.1.8
- Framer Motion 12.15.0
- React Router 7.6.1
- Leaflet 1.9.4
- JSZip 3.10.1

UI Components:
- Shadcn UI (Radix UI components)
- Lucide React (icons)
- Sonner (toast notifications)

To install all dependencies:
  pnpm install

For the complete package.json, see your project directory.
`;

    zip.file("DEPENDENCIES.txt", packageInfo);

    // Add project structure as a text file
    const structureInfo = `
VIRASAT - Project File Structure
==================================

src/
├── pages/
│   ├── Landing.tsx
│   ├── Explore.tsx
│   ├── SiteDetail.tsx
│   ├── AdminDashboard.tsx
│   ├── Auth.tsx
│   ├── Favorites.tsx
│   └── NotFound.tsx
│
├── components/
│   ├── ParticleBackground.tsx
│   ├── HolographicCard.tsx
│   ├── FloatingElement.tsx
│   ├── AnimatedSection.tsx
│   ├── InteractiveMap.tsx
│   ├── LogoDropdown.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── [50+ more UI components]
│
├── convex/
│   ├── schema.ts
│   ├── heritageSites.ts
│   ├── media.ts
│   ├── audio.ts
│   ├── favorites.ts
│   ├── users.ts
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── http.ts
│   ├── makeAdmin.ts
│   ├── seedData.ts
│   ├── addSampleImages.ts
│   ├── addMorePhotos.ts
│   ├── updateRemainingUrls.ts
│   └── auth/
│       └── emailOtp.ts
│
├── lib/
│   ├── utils.ts
│   └── downloadSource.ts
│
├── hooks/
│   ├── use-auth.ts
│   └── use-mobile.ts
│
├── types/
│   └── global.d.ts
│
├── index.css
├── main.tsx
├── instrumentation.tsx
└── vite-env.d.ts

public/
├── india-states.geojson
├── india.geojson
├── logo.svg
├── logo.png
├── logo_bg.svg
└── logo_bg.png

Root Configuration Files:
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── components.json
├── eslint.config.js
├── index.html
└── README.md
`;

    zip.file("PROJECT_STRUCTURE.txt", structureInfo);

    // Generate the ZIP file
    const blob = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `virasat-project-info-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error creating download:", error);
    throw error;
  }
}