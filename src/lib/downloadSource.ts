import JSZip from "jszip";

export async function downloadSourceCode() {
  const zip = new JSZip();

  // Define all source files to include in the download
  const filesToDownload = [
    // Root config files
    "package.json",
    "README.md",
    "components.json",
    "index.html",
    "eslint.config.js",
    "tsconfig.json",
    "vite.config.ts",
    
    // Source files - we'll need to fetch these from the server
    // Since we're in a browser environment, we'll need to use fetch or include them statically
  ];

  try {
    // Create a comprehensive README for the downloaded source
    zip.file("DOWNLOADED_README.txt", `
VIRASAT - Heritage Explorer Source Code
========================================

This is the complete source code for the VIRASAT Heritage Explorer application.

To run this project:
1. Install dependencies: pnpm install
2. Set up Convex: npx convex dev
3. Start the dev server: pnpm dev

Project Structure:
- src/pages/ - React pages (Landing, Explore, SiteDetail, etc.)
- src/components/ - Reusable React components
- src/convex/ - Backend functions and database schema
- src/lib/ - Utility functions
- src/hooks/ - Custom React hooks

For more information, see README.md

Downloaded on: ${new Date().toLocaleString()}
    `);

    // Fetch and add the actual package.json
    try {
      const packageResponse = await fetch('/package.json');
      if (packageResponse.ok) {
        const packageText = await packageResponse.text();
        zip.file("package.json", packageText);
      }
    } catch (e) {
      console.warn("Could not fetch package.json");
    }

    // List of all source files to include
    const sourceFiles = [
      // Pages
      "src/pages/Landing.tsx",
      "src/pages/Explore.tsx",
      "src/pages/SiteDetail.tsx",
      "src/pages/AdminDashboard.tsx",
      "src/pages/Auth.tsx",
      "src/pages/Favorites.tsx",
      "src/pages/NotFound.tsx",
      
      // Components
      "src/components/ParticleBackground.tsx",
      "src/components/HolographicCard.tsx",
      "src/components/FloatingElement.tsx",
      "src/components/AnimatedSection.tsx",
      "src/components/InteractiveMap.tsx",
      "src/components/LogoDropdown.tsx",
      
      // UI Components
      "src/components/ui/button.tsx",
      "src/components/ui/card.tsx",
      "src/components/ui/input.tsx",
      "src/components/ui/badge.tsx",
      "src/components/ui/dialog.tsx",
      "src/components/ui/tabs.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/textarea.tsx",
      "src/components/ui/label.tsx",
      "src/components/ui/switch.tsx",
      "src/components/ui/alert.tsx",
      "src/components/ui/avatar.tsx",
      "src/components/ui/accordion.tsx",
      "src/components/ui/alert-dialog.tsx",
      "src/components/ui/aspect-ratio.tsx",
      "src/components/ui/breadcrumb.tsx",
      "src/components/ui/calendar.tsx",
      "src/components/ui/carousel.tsx",
      "src/components/ui/chart.tsx",
      "src/components/ui/checkbox.tsx",
      "src/components/ui/collapsible.tsx",
      "src/components/ui/command.tsx",
      "src/components/ui/context-menu.tsx",
      "src/components/ui/drawer.tsx",
      "src/components/ui/dropdown-menu.tsx",
      "src/components/ui/form.tsx",
      "src/components/ui/hover-card.tsx",
      "src/components/ui/input-otp.tsx",
      "src/components/ui/menubar.tsx",
      "src/components/ui/navigation-menu.tsx",
      "src/components/ui/pagination.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/progress.tsx",
      "src/components/ui/radio-group.tsx",
      "src/components/ui/resizable.tsx",
      "src/components/ui/scroll-area.tsx",
      "src/components/ui/separator.tsx",
      "src/components/ui/sheet.tsx",
      "src/components/ui/sidebar.tsx",
      "src/components/ui/skeleton.tsx",
      "src/components/ui/slider.tsx",
      "src/components/ui/sonner.tsx",
      "src/components/ui/table.tsx",
      "src/components/ui/toggle.tsx",
      "src/components/ui/toggle-group.tsx",
      "src/components/ui/tooltip.tsx",
      
      // Convex backend
      "src/convex/schema.ts",
      "src/convex/heritageSites.ts",
      "src/convex/media.ts",
      "src/convex/audio.ts",
      "src/convex/favorites.ts",
      "src/convex/users.ts",
      "src/convex/auth.ts",
      "src/convex/auth.config.ts",
      "src/convex/http.ts",
      "src/convex/makeAdmin.ts",
      "src/convex/seedData.ts",
      "src/convex/addSampleImages.ts",
      "src/convex/addMorePhotos.ts",
      "src/convex/updateRemainingUrls.ts",
      "src/convex/auth/emailOtp.ts",
      
      // Lib and hooks
      "src/lib/utils.ts",
      "src/lib/downloadSource.ts",
      "src/hooks/use-auth.ts",
      "src/hooks/use-mobile.ts",
      
      // Styles and config
      "src/index.css",
      "src/main.tsx",
      "src/instrumentation.tsx",
      "src/vite-env.d.ts",
      "src/types/global.d.ts",
    ];

    // Fetch each source file and add to ZIP
    const fetchPromises = sourceFiles.map(async (filePath) => {
      try {
        const response = await fetch(`/${filePath}`);
        if (response.ok) {
          const content = await response.text();
          zip.file(filePath, content);
        } else {
          console.warn(`Could not fetch ${filePath}`);
        }
      } catch (error) {
        console.warn(`Error fetching ${filePath}:`, error);
      }
    });

    // Wait for all files to be fetched
    await Promise.all(fetchPromises);

    // Add config files
    const configFiles = [
      "package.json",
      "README.md",
      "components.json",
      "index.html",
    ];

    for (const configFile of configFiles) {
      try {
        const response = await fetch(`/${configFile}`);
        if (response.ok) {
          const content = await response.text();
          zip.file(configFile, content);
        }
      } catch (error) {
        console.warn(`Error fetching ${configFile}:`, error);
      }
    }

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
    link.download = `virasat-complete-source-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error creating source code download:", error);
    throw error;
  }
}