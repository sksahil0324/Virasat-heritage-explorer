import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const addPhotosToSites = internalMutation({
  args: {
    monumentPhotos: v.any(),
  },
  handler: async (ctx, args) => {
    const monumentPhotos = args.monumentPhotos as Record<string, string[]>;
    let addedCount = 0;

    for (const [monumentName, photoUrls] of Object.entries(monumentPhotos)) {
      // Find the site by name
      const sites = await ctx.db.query("heritageSites").collect();
      const site = sites.find((s) => s.name === monumentName);

      if (!site) continue;

      // Check existing media count
      const existingMedia = await ctx.db
        .query("media")
        .withIndex("by_site", (q) => q.eq("siteId", site._id))
        .collect();

      // Only add if site has fewer than 5 images
      if (existingMedia.filter((m) => m.type === "image").length < 5) {
        for (const photoUrl of photoUrls) {
          // Check if URL already exists
          const exists = existingMedia.some((m) => m.url === photoUrl);
          
          if (!exists) {
            await ctx.db.insert("media", {
              siteId: site._id,
              type: "image",
              url: photoUrl,
              caption: `${monumentName} - Auto-added photo`,
              isPrimary: false,
            });
            addedCount++;
          }
        }
      }
    }

    return { success: true, addedCount };
  },
});

export const getSitesNeedingPhotos = internalQuery({
  args: { threshold: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 5;
    const sites = await ctx.db.query("heritageSites").collect();

    const needing: Array<{
      siteId: Id<"heritageSites">;
      name: string;
      city?: string;
      state: string;
    }> = [];

    for (const site of sites) {
      const media = await ctx.db
        .query("media")
        .withIndex("by_site", (q) => q.eq("siteId", site._id))
        .collect();
      const imageCount = media.filter((m) => m.type === "image").length;
      if (imageCount < threshold) {
        needing.push({
          siteId: site._id,
          name: site.name,
          city: site.city,
          state: site.state,
        });
      }
    }

    return needing;
  },
});

export const addPhotosForSite = internalMutation({
  args: {
    siteId: v.id("heritageSites"),
    urls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("media")
      .withIndex("by_site", (q) => q.eq("siteId", args.siteId))
      .collect();

    let added = 0;
    for (const url of args.urls) {
      const already = existing.some((m) => m.url === url);
      if (!already) {
        await ctx.db.insert("media", {
          siteId: args.siteId,
          type: "image",
          url,
          caption: "Auto-added from Unsplash",
          isPrimary: false,
        });
        added++;
      }
    }
    return { added };
  },
});