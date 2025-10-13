import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get user's favorites
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const sites = await Promise.all(
      favorites.map(async (fav) => {
        const site = await ctx.db.get(fav.siteId);
        return site;
      })
    );

    return sites.filter((site) => site !== null);
  },
});

// Check if site is favorited
export const isFavorited = query({
  args: { siteId: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_site", (q) => q.eq("userId", user._id).eq("siteId", args.siteId))
      .first();

    return favorite !== null;
  },
});

// Toggle favorite
export const toggle = mutation({
  args: { siteId: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be logged in");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_site", (q) => q.eq("userId", user._id).eq("siteId", args.siteId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { favorited: false };
    } else {
      await ctx.db.insert("favorites", {
        userId: user._id,
        siteId: args.siteId,
      });
      return { favorited: true };
    }
  },
});
