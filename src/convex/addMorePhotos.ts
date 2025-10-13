import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addMorePhotos = mutation({
  args: {},
  handler: async (ctx) => {
    // Additional photos for heritage sites from Unsplash
    const photoData = [
      // Taj Mahal - already has 3 photos
      
      // Qutub Minar
      { siteId: "k97c0qhxqvjjww5p4jt48aam7n7sdmdj" as any, url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", caption: "Qutub Minar - Architectural Detail", isPrimary: false },
      
      // Red Fort
      { siteId: "k97d1rhyrvkkxx6q5ku59bbn8o8tenet" as any, url: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800", caption: "Red Fort - Interior View", isPrimary: false },
      
      // Hawa Mahal
      { siteId: "k97e2sizsxllzz7r6lv6accn9p9ufofv" as any, url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", caption: "Hawa Mahal - Evening View", isPrimary: false },
      
      // Amber Fort
      { siteId: "k97f3tjktymmaa8s7mw7bddo0q0vgpgw" as any, url: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800", caption: "Amber Fort - Palace Courtyard", isPrimary: false },
      
      // Gateway of India
      { siteId: "k97g4ukluznnbb9t8nx8ceep1r1whqhx" as any, url: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800", caption: "Gateway of India - Sunset", isPrimary: false },
      
      // Ajanta Caves
      { siteId: "k97h5vlmv0oocc0u9oy9dffq2s2xiriy" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800", caption: "Ajanta Caves - Cave Paintings", isPrimary: false },
      
      // Ellora Caves
      { siteId: "k97i6wmn01ppdd1v0pz0eggr3t3yjsjz" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f25?w=800", caption: "Ellora Caves - Kailasa Temple", isPrimary: false },
      
      // Hampi
      { siteId: "k97j7xno12qqee2w1q01fhhs4u4zktk0" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f26?w=800", caption: "Hampi - Stone Chariot", isPrimary: false },
      
      // Konark Sun Temple
      { siteId: "k97k8yop23rrff3x2r12giit5v50lul1" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f27?w=800", caption: "Konark Sun Temple - Wheel Detail", isPrimary: false },
      
      // Khajuraho
      { siteId: "k97l9zpq34ssgg4y3s23hjju6w61mvm2" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f28?w=800", caption: "Khajuraho - Temple Sculptures", isPrimary: false },
    ];

    let addedCount = 0;
    
    for (const photo of photoData) {
      // Check if site exists
      const sites = await ctx.db.query("heritageSites").collect();
      const site = sites.find(s => s._id === photo.siteId);
      
      if (site) {
        // Add media entry
        await ctx.db.insert("media", {
          siteId: photo.siteId,
          type: "image",
          url: photo.url,
          caption: photo.caption,
          isPrimary: photo.isPrimary,
        });
        addedCount++;
      }
    }

    return { success: true, addedCount };
  },
});
