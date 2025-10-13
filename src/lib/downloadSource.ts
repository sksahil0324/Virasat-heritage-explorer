import JSZip from "jszip";

export async function downloadSourceCode() {
  const zip = new JSZip();

  // Define files to include in the download
  const filesToDownload = [
    // Root config files
    "package.json",
    "README.md",
    "components.json",
    "index.html",
    "eslint.config.js",
    
    // Source files - we'll fetch these from the public API or include them statically
    // For a real implementation, you'd need a backend endpoint to serve these files
  ];

  try {
    // Create a simple README for the downloaded source
    zip.file("DOWNLOADED_README.txt", `
VIRASAT - Heritage Explorer Source Code
========================================

This is the source code for the VIRASAT Heritage Explorer application.

To run this project:
1. Install dependencies: pnpm install
2. Set up Convex: npx convex dev
3. Start the dev server: pnpm dev

For more information, see README.md

Downloaded on: ${new Date().toLocaleString()}
    `);

    // Add package.json info
    const packageInfo = {
      name: "virasat-heritage-explorer",
      version: "1.0.0",
      description: "A platform for exploring India's cultural heritage sites",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview"
      },
      note: "This is a simplified version. Please refer to the full repository for complete source code."
    };
    
    zip.file("package.json", JSON.stringify(packageInfo, null, 2));

    // Generate the ZIP file
    const blob = await zip.generateAsync({ type: "blob" });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `virasat-source-${Date.now()}.zip`;
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
