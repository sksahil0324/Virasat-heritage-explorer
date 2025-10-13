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
