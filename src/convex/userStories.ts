import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Submit a new story
export const submitStory = mutation({
  args: {
    siteId: v.id("heritageSites"),
    content: v.string(),
    type: v.union(v.literal("story"), v.literal("community")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to submit a story");
    }

    const storyId = await ctx.db.insert("userStories", {
      siteId: args.siteId,
      userId: user._id,
      content: args.content,
      type: args.type,
      userName: user.name || "Anonymous",
      isApproved: false,
    });

    return storyId;
  },
});

// Get approved stories for a site
export const getStoriesBySite = query({
  args: {
    siteId: v.id("heritageSites"),
    type: v.union(v.literal("story"), v.literal("community")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userStories")
      .withIndex("by_site_and_approved", (q) =>
        q.eq("siteId", args.siteId).eq("isApproved", true)
      )
      .collect()
      .then((stories) => stories.filter((s) => s.type === args.type));
  },
});

// Admin: Get all stories for moderation
export const getAllStories = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("userStories").collect();
  },
});

// Admin: Approve a story
export const approveStory = mutation({
  args: { storyId: v.id("userStories") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.storyId, { isApproved: true });
  },
});

// Admin: Reject a story
export const rejectStory = mutation({
  args: { storyId: v.id("userStories") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.storyId);
  },
});
