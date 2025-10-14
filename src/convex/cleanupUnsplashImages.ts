import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Remove Unsplash images and set first uploaded image as primary
export const removeUnsplashImages = mutation({
  args: { siteId: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Get all media for this site
    const allMedia = await ctx.db
      .query("media")
      .withIndex("by_site", (q) => q.eq("siteId", args.siteId))
      .collect();

    // Find and delete Unsplash images (those without storageId)
    const unsplashImages = allMedia.filter((m) => !m.storageId);
    for (const img of unsplashImages) {
      await ctx.db.delete(img._id);
    }

    // Get remaining uploaded images
    const uploadedImages = allMedia.filter((m) => m.storageId && m.type === "image");

    // Set the first uploaded image as primary if exists
    if (uploadedImages.length > 0) {
      // Remove primary flag from all
      for (const img of uploadedImages) {
        if (img.isPrimary) {
          await ctx.db.patch(img._id, { isPrimary: false });
        }
      }
      // Set first one as primary
      await ctx.db.patch(uploadedImages[0]._id, { isPrimary: true });
    }

    return {
      removed: unsplashImages.length,
      remaining: uploadedImages.length,
    };
  },
});
