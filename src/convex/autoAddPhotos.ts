"use node";

import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const fetchAndAddMonumentPhotos = internalAction({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; sitesChecked: number; totalAdded: number }> => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error(
        "UNSPLASH_ACCESS_KEY is not set. Please open Integrations → Unsplash and add your Access Key."
      );
    }

    // Get list of sites that need more photos
    const sitesNeeding = await ctx.runQuery(
      internal.autoAddPhotosMutation.getSitesNeedingPhotos,
      { threshold: 5 }
    );

    let totalAdded = 0;

    for (const site of sitesNeeding) {
      // Create a more specific search query
      // Use the monument name and state for better accuracy
      const query = `${site.name} ${site.state} India heritage architecture`.trim();
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=3&orientation=landscape&content_filter=high&client_id=${accessKey}`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn("Unsplash API error:", res.status, await res.text());
          continue;
        }
        const data: any = await res.json();
        const results: any[] = Array.isArray(data?.results) ? data.results : [];

        const photoUrls: string[] = [];
        for (const p of results) {
          const imgUrl: string =
            p?.urls?.regular || p?.urls?.full || p?.urls?.small;
          if (imgUrl) photoUrls.push(imgUrl);

          // Track the download event per Unsplash guidelines (best effort)
          const dl = p?.links?.download_location;
          if (dl) {
            try {
              await fetch(`${dl}?client_id=${accessKey}`);
            } catch {
              // ignore tracking errors
            }
          }
        }

        if (photoUrls.length > 0) {
          const { added } = await ctx.runMutation(
            internal.autoAddPhotosMutation.addPhotosForSite,
            { siteId: site.siteId, urls: photoUrls }
          );
          totalAdded += added;
        }
      } catch (e) {
        console.warn("Error fetching Unsplash photos for", site.name, e);
      }
    }

    return { success: true, sitesChecked: sitesNeeding.length, totalAdded };
  },
});

export const runAutoAddPhotos = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; sitesChecked: number; totalAdded: number }> => {
    return await ctx.runAction(
      internal.autoAddPhotos.fetchAndAddMonumentPhotos,
      {}
    );
  },
});

export const bulkAddPhotosNow = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; sitesChecked: number; totalAdded: number }> => {
    return await ctx.runAction(
      internal.autoAddPhotos.fetchAndAddMonumentPhotos,
      {}
    );
  },
});