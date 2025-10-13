import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Add audio summary
export const add = mutation({
  args: {
    siteId: v.id("heritageSites"),
    storageId: v.id("_storage"),
    duration: v.optional(v.number()),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    return await ctx.db.insert("audioSummaries", {
      siteId: args.siteId,
      storageId: args.storageId,
      url,
      duration: args.duration,
      language: args.language,
      playCount: 0,
    });
  },
});

// Increment play count
export const incrementPlayCount = mutation({
  args: { id: v.id("audioSummaries") },
  handler: async (ctx, args) => {
    const audio = await ctx.db.get(args.id);
    if (!audio) throw new Error("Audio not found");

    await ctx.db.patch(args.id, {
      playCount: audio.playCount + 1,
    });
  },
});

// Remove audio
export const remove = mutation({
  args: { id: v.id("audioSummaries") },
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
