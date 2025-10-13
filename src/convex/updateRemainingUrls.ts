import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateRemainingImmersiveUrls = mutation({
  args: {},
  handler: async (ctx) => {
    const sites = await ctx.db.query("heritageSites").collect();
    
    const urlMappings: Record<string, { view360Url?: string; view3dUrl?: string }> = {
      "Taj Mahal": {
        view360Url: "https://artsandculture.google.com/story/taj-mahal/",
        view3dUrl: "https://artsandculture.google.com/asset/taj-mahal/"
      },
      "Meenakshi Temple": {
        view360Url: "https://artsandculture.google.com/story/meenakshi-temple/",
        view3dUrl: "https://artsandculture.google.com/asset/meenakshi-temple/"
      },
      "Hawa Mahal": {
        view360Url: "https://artsandculture.google.com/story/hawa-mahal/",
        view3dUrl: "https://artsandculture.google.com/asset/hawa-mahal/"
      },
      "Golden Temple (Harmandir Sahib)": {
        view360Url: "https://artsandculture.google.com/story/golden-temple/",
        view3dUrl: "https://artsandculture.google.com/asset/golden-temple/"
      },
      "Ellora Caves": {
        view360Url: "https://artsandculture.google.com/story/ellora-caves/",
        view3dUrl: "https://artsandculture.google.com/asset/ellora-caves-kailasa-temple/"
      },
      "Victoria Memorial": {
        view360Url: "https://artsandculture.google.com/story/victoria-memorial/",
        view3dUrl: "https://artsandculture.google.com/asset/victoria-memorial/"
      },
      "Sanchi Stupa": {
        view360Url: "https://artsandculture.google.com/story/sanchi-stupa/",
        view3dUrl: "https://artsandculture.google.com/asset/sanchi-stupa/"
      },
      "Charminar": {
        view360Url: "https://artsandculture.google.com/story/charminar/",
        view3dUrl: "https://artsandculture.google.com/asset/charminar/"
      },
      "Jaisalmer Fort": {
        view360Url: "https://artsandculture.google.com/story/jaisalmer-fort/",
        view3dUrl: "https://artsandculture.google.com/asset/jaisalmer-fort/"
      },
      "Mahabodhi Temple": {
        view360Url: "https://artsandculture.google.com/story/mahabodhi-temple/",
        view3dUrl: "https://artsandculture.google.com/asset/mahabodhi-temple/"
      },
      "Brihadeeswarar Temple": {
        view360Url: "https://artsandculture.google.com/story/brihadeeswarar-temple/",
        view3dUrl: "https://artsandculture.google.com/asset/brihadeeswarar-temple/"
      },
      "Gol Gumbaz": {
        view360Url: "https://artsandculture.google.com/story/gol-gumbaz/",
        view3dUrl: "https://artsandculture.google.com/asset/gol-gumbaz/"
      },
      "Nalanda University Ruins": {
        view360Url: "https://artsandculture.google.com/story/nalanda-university/",
        view3dUrl: "https://artsandculture.google.com/asset/nalanda-university/"
      },
      "Chittorgarh Fort": {
        view360Url: "https://artsandculture.google.com/story/chittorgarh-fort/",
        view3dUrl: "https://artsandculture.google.com/asset/chittorgarh-fort/"
      },
      "Sundarbans National Park": {
        view360Url: "https://artsandculture.google.com/story/sundarbans/",
        view3dUrl: "https://artsandculture.google.com/asset/sundarbans-mangroves/"
      }
    };

    let updatedCount = 0;
    
    for (const site of sites) {
      const urls = urlMappings[site.name];
      // Only update if URLs exist in mapping and site doesn't already have them
      if (urls && (!site.view360Url || !site.view3dUrl)) {
        await ctx.db.patch(site._id, urls);
        updatedCount++;
      }
    }

    return { success: true, updatedCount, totalSites: sites.length };
  },
});
