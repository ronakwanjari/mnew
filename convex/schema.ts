
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    userType: v.union(v.literal("patient"), v.literal("doctor"), v.literal("admin")),
  }).index("by_clerk_id", ["clerkId"]),

  doctors: defineTable({
    clerkId: v.string(),
    name: v.string(),
    specialty: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
    about: v.optional(v.string()),
    languages: v.array(v.string()),
    availability: v.array(v.string()),
    consultationFee: v.number(),
    rating: v.number(),
    totalReviews: v.number(),
    image: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }).index("by_clerk_id", ["clerkId"]).index("by_specialty", ["specialty"]),

  appointments: defineTable({
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
  }).index("by_patient", ["patientId"]).index("by_doctor", ["doctorId"]),

  vitals: defineTable({
    patientId: v.string(),
    heartRate: v.optional(v.number()),
    spo2: v.optional(v.number()),
    temperature: v.optional(v.number()),
    bmi: v.optional(v.number()),
  }),

  chatSessions: defineTable({
    patientId: v.string(),
    sessionStart: v.string(),
    sessionEnd: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
  }).index("by_patient", ["patientId"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    message: v.string(),
    sender: v.union(v.literal("user"), v.literal("bot")),
    severity: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    appointmentSuggested: v.boolean(),
  }).index("by_session", ["sessionId"]),

  pharmacies: defineTable({
    name: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }),
});
