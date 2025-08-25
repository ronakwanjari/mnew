
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAppointment = mutation({
  args: {
    patientId: v.string(),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    doctorId: v.string(),
    doctorName: v.optional(v.string()),
    doctorEmail: v.optional(v.string()),
    appointmentDate: v.string(),
    appointmentTime: v.string(),
    reason: v.string(),
    symptoms: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    consultationFee: v.number(),
    meetingLink: v.optional(v.string()),
    doctorNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const meetingLink = `https://medibot-meet.com/room/${Date.now()}`;
    return await ctx.db.insert("appointments", {
      ...args,
      meetingLink,
    });
  },
});

export const getAppointments = query({
  args: {
    patientId: v.optional(v.string()),
    doctorId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let appointments = await ctx.db.query("appointments").collect();

    if (args.patientId) {
      appointments = appointments.filter(apt => apt.patientId === args.patientId);
    }

    if (args.doctorId) {
      appointments = appointments.filter(apt => apt.doctorId === args.doctorId);
    }

    if (args.status) {
      appointments = appointments.filter(apt => apt.status === args.status);
    }

    return appointments.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const updateAppointment = mutation({
  args: {
    id: v.id("appointments"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
    doctorNotes: v.optional(v.string()),
    meetingLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(id, filteredData);
  },
});

export const getAppointmentStats = query({
  handler: async (ctx) => {
    const appointments = await ctx.db.query("appointments").collect();
    
    const stats = appointments.reduce((acc, apt) => {
      acc.total++;
      acc[apt.status as keyof typeof acc] = (acc[apt.status as keyof typeof acc] || 0) + 1;
      return acc;
    }, {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0
    });

    return stats;
  },
});
