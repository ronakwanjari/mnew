
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveVitals = mutation({
  args: {
    patientId: v.string(),
    heartRate: v.optional(v.number()),
    spo2: v.optional(v.number()),
    temperature: v.optional(v.number()),
    bmi: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vitals", args);
  },
});

export const getVitals = query({
  args: {
    patientId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const vitals = await ctx.db
      .query("vitals")
      .filter((q) => q.eq(q.field("patientId"), args.patientId))
      .collect();
    
    const sorted = vitals.sort((a, b) => b._creationTime - a._creationTime);
    
    if (args.limit) {
      return sorted.slice(0, args.limit);
    }
    
    return sorted;
  },
});
