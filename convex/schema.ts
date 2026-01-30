import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    villas: defineTable({
        name: v.string(),
        identifier: v.string(), // "villa-3" or "villa-17"
        // Add other villa config fields as needed
    }),
    bookings: defineTable({
        villaId: v.id("villas"),
        guest_name: v.string(),
        guest_email: v.optional(v.string()), // Optional fields
        guest_phone: v.optional(v.string()),
        guest_count: v.number(),
        startDate: v.number(), // Unix timestamp
        endDate: v.number(),   // Unix timestamp
        total_amount: v.optional(v.number()),
        status: v.string(),    // "confirmed", "inquiry", "cancelled"
        booking_source: v.optional(v.string()),
        // Add other booking fields from original project
    }).index("by_villaId", ["villaId"]),
    villas: defineTable({
        identifier: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        color: v.optional(v.string()),
        image: v.optional(v.string()),
    }).index("by_identifier", ["identifier"]),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.string(), // "admin"
    }),
});
