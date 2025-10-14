import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateKonark3DModel = mutation({
  args: {},
  handler: async (ctx) => {
    // Find Konark Sun Temple
    const sites = await ctx.db.query("heritageSites").collect();
    const konarkTemple = sites.find(site => site.name === "Konark Sun Temple");
    
    if (!konarkTemple) {
      throw new Error("Konark Sun Temple not found");
    }
    
    // Update with Sketchfab embed URL
    await ctx.db.patch(konarkTemple._id, {
      view3dUrl: "https://sketchfab.com/models/6cc905be2ae34e8091eb1eaa84a17738/embed"
    });
    
    return { success: true, siteId: konarkTemple._id, siteName: konarkTemple.name };
  },
});
