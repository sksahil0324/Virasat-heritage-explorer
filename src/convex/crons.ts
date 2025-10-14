import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run weekly to keep monument photos updated
crons.weekly(
  "weekly-monument-photos",
  { dayOfWeek: "monday", hourUTC: 2, minuteUTC: 0 },
  internal.autoAddPhotos.fetchAndAddMonumentPhotos
);

export default crons;
