import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Heritage site categories
export const SITE_CATEGORIES = {
  TEMPLE: "temple",
  FORT: "fort",
  PALACE: "palace",
  MONUMENT: "monument",
  MUSEUM: "museum",
  ARCHAEOLOGICAL: "archaeological",
  NATURAL: "natural",
  OTHER: "other",
} as const;

export const categoryValidator = v.union(
  v.literal(SITE_CATEGORIES.TEMPLE),
  v.literal(SITE_CATEGORIES.FORT),
  v.literal(SITE_CATEGORIES.PALACE),
  v.literal(SITE_CATEGORIES.MONUMENT),
  v.literal(SITE_CATEGORIES.MUSEUM),
  v.literal(SITE_CATEGORIES.ARCHAEOLOGICAL),
  v.literal(SITE_CATEGORIES.NATURAL),
  v.literal(SITE_CATEGORIES.OTHER),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    // Heritage sites table
    heritageSites: defineTable({
      name: v.string(),
      description: v.string(),
      historicalSignificance: v.string(),
      category: categoryValidator,
      state: v.string(),
      city: v.string(),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      isUNESCO: v.boolean(),
      timePeriod: v.optional(v.string()),
      visitorGuidelines: v.optional(v.string()),
      viewCount: v.number(),
      isPublished: v.boolean(),
      createdBy: v.id("users"),
      folkTales: v.optional(v.string()),
      culturalHeritage: v.optional(v.string()),
      cuisine: v.optional(v.string()),
      stories: v.optional(v.string()),
      community: v.optional(v.string()),
      ticketPrice: v.optional(v.string()),
      openingHours: v.optional(v.string()),
      bestTimeToVisit: v.optional(v.string()),
      timezone: v.optional(v.string()),
      view360Url: v.optional(v.string()),
      view3dUrl: v.optional(v.string()),
    })
      .index("by_state", ["state"])
      .index("by_category", ["category"])
      .index("by_published", ["isPublished"])
      .index("by_unesco", ["isUNESCO"])
      .index("by_view_count", ["viewCount"]),

    // Media files for heritage sites
    media: defineTable({
      siteId: v.id("heritageSites"),
      type: v.union(v.literal("image"), v.literal("video"), v.literal("model3d"), v.literal("panorama")),
      storageId: v.optional(v.id("_storage")),
      url: v.string(),
      caption: v.optional(v.string()),
      isPrimary: v.boolean(),
    }).index("by_site", ["siteId"]),

    // Audio summaries
    audioSummaries: defineTable({
      siteId: v.id("heritageSites"),
      storageId: v.id("_storage"),
      url: v.string(),
      duration: v.optional(v.number()),
      language: v.string(),
      playCount: v.number(),
    }).index("by_site", ["siteId"]),

    // User favorites
    favorites: defineTable({
      userId: v.id("users"),
      siteId: v.id("heritageSites"),
    })
      .index("by_user", ["userId"])
      .index("by_site", ["siteId"])
      .index("by_user_and_site", ["userId", "siteId"]),

    // User-submitted stories
    userStories: defineTable({
      siteId: v.id("heritageSites"),
      userId: v.id("users"),
      content: v.string(),
      type: v.union(v.literal("story"), v.literal("community")),
      userName: v.string(),
      isApproved: v.boolean(),
    })
      .index("by_site", ["siteId"])
      .index("by_user", ["userId"])
      .index("by_site_and_approved", ["siteId", "isApproved"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;