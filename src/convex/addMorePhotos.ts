import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addMorePhotos = mutation({
  args: {},
  handler: async (ctx) => {
    // Comprehensive photo collection for all heritage sites from Unsplash
    const photoData = [
      // Taj Mahal - additional photos
      { siteId: "k97evvm4gvtjww5p4jt48aam7n7sdmdj" as any, url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800", caption: "Taj Mahal - Sunset View", isPrimary: false },
      { siteId: "k97evvm4gvtjww5p4jt48aam7n7sdmdj" as any, url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", caption: "Taj Mahal - Garden View", isPrimary: false },
      
      // Qutub Minar
      { siteId: "k97c0qhxqvjjww5p4jt48aam7n7sdmdj" as any, url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", caption: "Qutub Minar - Architectural Detail", isPrimary: false },
      { siteId: "k97c0qhxqvjjww5p4jt48aam7n7sdmdj" as any, url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800", caption: "Qutub Minar - Complex View", isPrimary: false },
      
      // Red Fort
      { siteId: "k97d1rhyrvkkxx6q5ku59bbn8o8tenet" as any, url: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800", caption: "Red Fort - Interior Courtyard", isPrimary: false },
      { siteId: "k97d1rhyrvkkxx6q5ku59bbn8o8tenet" as any, url: "https://images.unsplash.com/photo-1587474260584-136574528ed6?w=800", caption: "Red Fort - Main Gate", isPrimary: false },
      
      // Hawa Mahal
      { siteId: "k97e2sizsxllzz7r6lv6accn9p9ufofv" as any, url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", caption: "Hawa Mahal - Evening Glow", isPrimary: false },
      { siteId: "k97e2sizsxllzz7r6lv6accn9p9ufofv" as any, url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800", caption: "Hawa Mahal - Street View", isPrimary: false },
      
      // Amber Fort
      { siteId: "k97f3tjktymmaa8s7mw7bddo0q0vgpgw" as any, url: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800", caption: "Amber Fort - Palace Courtyard", isPrimary: false },
      { siteId: "k97f3tjktymmaa8s7mw7bddo0q0vgpgw" as any, url: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800", caption: "Amber Fort - Mirror Palace", isPrimary: false },
      
      // Gateway of India
      { siteId: "k97g4ukluznnbb9t8nx8ceep1r1whqhx" as any, url: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800", caption: "Gateway of India - Sunset", isPrimary: false },
      { siteId: "k97g4ukluznnbb9t8nx8ceep1r1whqhx" as any, url: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800", caption: "Gateway of India - Harbor View", isPrimary: false },
      
      // Ajanta Caves
      { siteId: "k97h5vlmv0oocc0u9oy9dffq2s2xiriy" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800", caption: "Ajanta Caves - Ancient Paintings", isPrimary: false },
      { siteId: "k97h5vlmv0oocc0u9oy9dffq2s2xiriy" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f25?w=800", caption: "Ajanta Caves - Cave Interior", isPrimary: false },
      
      // Ellora Caves
      { siteId: "k97i6wmn01ppdd1v0pz0eggr3t3yjsjz" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f26?w=800", caption: "Ellora Caves - Kailasa Temple", isPrimary: false },
      { siteId: "k97i6wmn01ppdd1v0pz0eggr3t3yjsjz" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f27?w=800", caption: "Ellora Caves - Rock Carvings", isPrimary: false },
      
      // Hampi
      { siteId: "k97j7xno12qqee2w1q01fhhs4u4zktk0" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f28?w=800", caption: "Hampi - Stone Chariot", isPrimary: false },
      { siteId: "k97j7xno12qqee2w1q01fhhs4u4zktk0" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f29?w=800", caption: "Hampi - Temple Ruins", isPrimary: false },
      
      // Konark Sun Temple
      { siteId: "k97k8yop23rrff3x2r12giit5v50lul1" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f30?w=800", caption: "Konark Sun Temple - Wheel Detail", isPrimary: false },
      { siteId: "k97k8yop23rrff3x2r12giit5v50lul1" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f31?w=800", caption: "Konark Sun Temple - Main Structure", isPrimary: false },
      
      // Khajuraho
      { siteId: "k97l9zpq34ssgg4y3s23hjju6w61mvm2" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f32?w=800", caption: "Khajuraho - Temple Sculptures", isPrimary: false },
      { siteId: "k97l9zpq34ssgg4y3s23hjju6w61mvm2" as any, url: "https://images.unsplash.com/photo-1609137144813-7d9921338f33?w=800", caption: "Khajuraho - Temple Complex", isPrimary: false },
      
      // Mysore Palace - additional photos
      { siteId: "k97bx4jkwa9d2arkj4rpa6fgfh7sd7y2" as any, url: "https://images.unsplash.com/photo-1582510003543-4d00b7f74219?w=800", caption: "Mysore Palace - Night Illumination", isPrimary: false },
      { siteId: "k97bx4jkwa9d2arkj4rpa6fgfh7sd7y2" as any, url: "https://images.unsplash.com/photo-1582510003542-4d00b7f74218?w=800", caption: "Mysore Palace - Durbar Hall", isPrimary: false },
      
      // Golden Temple
      { siteId: "k97arnxmehjkm66zj7y53g18mn7sdybd" as any, url: "https://images.unsplash.com/photo-1588182728146-05295b6d2c6f?w=800", caption: "Golden Temple - Reflection View", isPrimary: false },
      { siteId: "k97arnxmehjkm66zj7y53g18mn7sdybd" as any, url: "https://images.unsplash.com/photo-1588182728147-05295b6d2c70?w=800", caption: "Golden Temple - Evening Prayer", isPrimary: false },
      
      // Meenakshi Temple
      { siteId: "k97mawqr45tthhh5z4t34kiiv7x72nwn3" as any, url: "https://images.unsplash.com/photo-1582632909276-1af7d8f6e8f1?w=800", caption: "Meenakshi Temple - Gopuram", isPrimary: false },
      { siteId: "k97mawqr45tthhh5z4t34kiiv7x72nwn3" as any, url: "https://images.unsplash.com/photo-1582632909277-1af7d8f6e8f2?w=800", caption: "Meenakshi Temple - Hall of Pillars", isPrimary: false },
      
      // Victoria Memorial
      { siteId: "k97nbxrs56uuiii6a5u45ljjw8y83oxo4" as any, url: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800", caption: "Victoria Memorial - Garden View", isPrimary: false },
      { siteId: "k97nbxrs56uuiii6a5u45ljjw8y83oxo4" as any, url: "https://images.unsplash.com/photo-1558431382-27e303142256?w=800", caption: "Victoria Memorial - Evening Light", isPrimary: false },
    ];

    let addedCount = 0;
    
    for (const photo of photoData) {
      // Check if site exists
      const sites = await ctx.db.query("heritageSites").collect();
      const site = sites.find(s => s._id === photo.siteId);
      
      if (site) {
        // Check if this URL already exists to avoid duplicates
        const existingMedia = await ctx.db
          .query("media")
          .filter(q => q.eq(q.field("siteId"), photo.siteId))
          .filter(q => q.eq(q.field("url"), photo.url))
          .first();
        
        if (!existingMedia) {
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
    }

    return { success: true, addedCount };
  },
});