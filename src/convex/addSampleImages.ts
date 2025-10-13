import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addSampleImages = mutation({
  args: {},
  handler: async (ctx) => {
    const sites = await ctx.db.query("heritageSites").collect();
    
    // Sample image URLs for heritage sites (using Unsplash)
    const imageUrls: Record<string, string[]> = {
      "Taj Mahal": [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
        "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800"
      ],
      "Hampi": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
        "https://images.unsplash.com/photo-1609920658906-8223bd289002?w=800"
      ],
      "Khajuraho Temples": [
        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800",
        "https://images.unsplash.com/photo-1598970434796-0c54fe7c0649?w=800"
      ],
      "Konark Sun Temple": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289003?w=800"
      ],
      "Ajanta Caves": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289004?w=800"
      ],
      "Mysore Palace": [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "https://images.unsplash.com/photo-1582510003545-4d00b7f74221?w=800"
      ],
      "Qutub Minar": [
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        "https://images.unsplash.com/photo-1587474260585-136574528ed6?w=800"
      ],
      "Meenakshi Temple": [
        "https://images.unsplash.com/photo-1582632909276-1f0b3fa4e3c5?w=800"
      ],
      "Hawa Mahal": [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
        "https://images.unsplash.com/photo-1599661046290-e31897846e42?w=800"
      ],
      "Golden Temple (Harmandir Sahib)": [
        "https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=800",
        "https://images.unsplash.com/photo-1586339277862-b0b895343ba6?w=800"
      ],
      "Ellora Caves": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289005?w=800"
      ],
      "Amer Fort": [
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
        "https://images.unsplash.com/photo-1599661046828-dacff0c0f09b?w=800"
      ],
      "Victoria Memorial": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289006?w=800"
      ],
      "Sanchi Stupa": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289007?w=800"
      ],
      "Charminar": [
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        "https://images.unsplash.com/photo-1596176530530-78163a4f7af3?w=800"
      ],
      "Jaisalmer Fort": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289008?w=800"
      ],
      "Mahabodhi Temple": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289009?w=800"
      ],
      "Brihadeeswarar Temple": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289010?w=800"
      ],
      "Red Fort": [
        "https://images.unsplash.com/photo-1587474260584-136574528ed7?w=800",
        "https://images.unsplash.com/photo-1587474260585-136574528ed8?w=800"
      ],
      "Gol Gumbaz": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289011?w=800"
      ],
      "Rani ki Vav": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289012?w=800"
      ],
      "Fatehpur Sikri": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289013?w=800"
      ],
      "Nalanda University Ruins": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289014?w=800"
      ],
      "Elephanta Caves": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289015?w=800"
      ],
      "Chittorgarh Fort": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289016?w=800"
      ],
      "Sundarbans National Park": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289017?w=800"
      ],
      "Jantar Mantar": [
        "https://images.unsplash.com/photo-1609920658906-8223bd289018?w=800"
      ]
    };

    let addedCount = 0;
    
    for (const site of sites) {
      const urls = imageUrls[site.name];
      if (urls) {
        for (let i = 0; i < urls.length; i++) {
          await ctx.db.insert("media", {
            siteId: site._id,
            type: "image",
            url: urls[i],
            caption: `${site.name} - View ${i + 1}`,
            isPrimary: i === 0,
          });
          addedCount++;
        }
      }
    }

    return { success: true, imagesAdded: addedCount, sitesProcessed: sites.length };
  },
});
