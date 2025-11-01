import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Add media to site
export const add = mutation({
  args: {
    siteId: v.id("heritageSites"),
    type: v.string(),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    isPrimary: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    return await ctx.db.insert("media", {
      siteId: args.siteId,
      type: args.type as any,
      storageId: args.storageId,
      url,
      caption: args.caption,
      isPrimary: args.isPrimary,
    });
  },
});

// Remove media
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

// Set media as primary
export const setPrimary = mutation({
  args: { 
    id: v.id("media"),
    siteId: v.id("heritageSites")
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Get all media for this site
    const siteMedia = await ctx.db
      .query("media")
      .withIndex("by_site", (q) => q.eq("siteId", args.siteId))
      .collect();

    // Set all to non-primary
    for (const media of siteMedia) {
      await ctx.db.patch(media._id, { isPrimary: false });
    }

    // Set the selected one as primary
    await ctx.db.patch(args.id, { isPrimary: true });
  },
});

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});