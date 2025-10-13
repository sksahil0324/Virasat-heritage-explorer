import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all published heritage sites
export const list = query({
  args: {
    category: v.optional(v.string()),
    state: v.optional(v.string()),
    unescoOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let sitesQuery = ctx.db.query("heritageSites").withIndex("by_published", (q) => q.eq("isPublished", true));

    const sites = await sitesQuery.collect();

    let filtered = sites;

    if (args.category && args.category !== "all") {
      filtered = filtered.filter((site) => site.category === args.category);
    }

    if (args.state && args.state !== "all") {
      filtered = filtered.filter((site) => site.state === args.state);
    }

    if (args.unescoOnly) {
      filtered = filtered.filter((site) => site.isUNESCO);
    }

    // Fetch media for each site
    const sitesWithMedia = await Promise.all(
      filtered.map(async (site) => {
        const media = await ctx.db
          .query("media")
          .withIndex("by_site", (q) => q.eq("siteId", site._id))
          .collect();
        return { ...site, media };
      })
    );

    return sitesWithMedia.sort((a, b) => b.viewCount - a.viewCount);
  },
});

// Get single heritage site with media and audio
export const getById = query({
  args: { id: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const site = await ctx.db.get(args.id);
    if (!site) return null;

    const media = await ctx.db
      .query("media")
      .withIndex("by_site", (q) => q.eq("siteId", args.id))
      .collect();

    const audio = await ctx.db
      .query("audioSummaries")
      .withIndex("by_site", (q) => q.eq("siteId", args.id))
      .collect();

    return {
      ...site,
      media,
      audio,
    };
  },
});

// Search heritage sites
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const sites = await ctx.db
      .query("heritageSites")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();

    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.state.toLowerCase().includes(searchLower) ||
        site.city.toLowerCase().includes(searchLower) ||
        site.description.toLowerCase().includes(searchLower)
    );
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const site = await ctx.db.get(args.id);
    if (!site) throw new Error("Site not found");

    await ctx.db.patch(args.id, {
      viewCount: site.viewCount + 1,
    });
  },
});

// Admin: Create heritage site
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    historicalSignificance: v.string(),
    category: v.union(
      v.literal("temple"),
      v.literal("fort"),
      v.literal("palace"),
      v.literal("monument"),
      v.literal("museum"),
      v.literal("archaeological"),
      v.literal("natural"),
      v.literal("other")
    ),
    state: v.string(),
    city: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isUNESCO: v.boolean(),
    timePeriod: v.optional(v.string()),
    visitorGuidelines: v.optional(v.string()),
    isPublished: v.boolean(),
    ticketPrice: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    bestTimeToVisit: v.optional(v.string()),
    timezone: v.optional(v.string()),
    view360Url: v.optional(v.string()),
    view3dUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const siteId = await ctx.db.insert("heritageSites", {
      ...args,
      viewCount: 0,
      createdBy: user._id,
    });

    return siteId;
  },
});

// Admin: Update heritage site
export const update = mutation({
  args: {
    id: v.id("heritageSites"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    historicalSignificance: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("temple"),
        v.literal("fort"),
        v.literal("palace"),
        v.literal("monument"),
        v.literal("museum"),
        v.literal("archaeological"),
        v.literal("natural"),
        v.literal("other")
      )
    ),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isUNESCO: v.optional(v.boolean()),
    timePeriod: v.optional(v.string()),
    visitorGuidelines: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    ticketPrice: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    bestTimeToVisit: v.optional(v.string()),
    timezone: v.optional(v.string()),
    view360Url: v.optional(v.string()),
    view3dUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Admin: Delete heritage site
export const remove = mutation({
  args: { id: v.id("heritageSites") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Delete associated media and audio
    const media = await ctx.db
      .query("media")
      .withIndex("by_site", (q) => q.eq("siteId", args.id))
      .collect();

    for (const m of media) {
      await ctx.db.delete(m._id);
    }

    const audio = await ctx.db
      .query("audioSummaries")
      .withIndex("by_site", (q) => q.eq("siteId", args.id))
      .collect();

    for (const a of audio) {
      await ctx.db.delete(a._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Admin: Get all sites (including unpublished)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("heritageSites").collect();
  },
});

// Get admin statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const sites = await ctx.db.query("heritageSites").collect();
    const totalViews = sites.reduce((sum, site) => sum + site.viewCount, 0);

    const audio = await ctx.db.query("audioSummaries").collect();
    const totalPlays = audio.reduce((sum, a) => sum + a.playCount, 0);

    return {
      totalSites: sites.length,
      publishedSites: sites.filter((s) => s.isPublished).length,
      totalViews,
      totalAudioPlays: totalPlays,
      unescoSites: sites.filter((s) => s.isUNESCO).length,
    };
  },
});