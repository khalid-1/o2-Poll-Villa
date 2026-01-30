import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getVillas = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("villas").collect();
    },
});

export const getBookings = query({
    args: { villaIdentifier: v.string() },
    handler: async (ctx, args) => {
        const villa = await ctx.db
            .query("villas")
            .filter((q) => q.eq(q.field("identifier"), args.villaIdentifier))
            .first();

        if (!villa) {
            return []; // Or throw error
        }

        return await ctx.db
            .query("bookings")
            .filter((q) => q.eq(q.field("villaId"), villa._id))
            .collect();
    },
});

export const createBooking = mutation({
    args: {
        villaIdentifier: v.string(), // changed from villaId to identifier lookup
        guest_name: v.string(),
        guest_email: v.optional(v.string()),
        guest_phone: v.optional(v.string()),
        guest_count: v.number(),
        startDate: v.number(),
        endDate: v.number(),
        total_amount: v.optional(v.number()),
        status: v.string(),
        booking_source: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const villa = await ctx.db
            .query("villas")
            .filter((q) => q.eq(q.field("identifier"), args.villaIdentifier))
            .first();

        if (!villa) {
            throw new Error("Villa not found");
        }

        const { villaIdentifier, ...bookingData } = args;

        return await ctx.db.insert("bookings", {
            ...bookingData,
            villaId: villa._id,
        });
    },
});

export const seedVillas = mutation({
    args: {},
    handler: async (ctx) => {
        const villas = [
            {
                identifier: "villa-3",
                name: "Villa 3",
                description: "3 Bedrooms • Garden View",
                color: "bg-emerald-500",
                image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80"
            },
            {
                identifier: "villa-17",
                name: "Villa 17",
                description: "4 Bedrooms • Poolside",
                color: "bg-blue-500",
                image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80"
            }
        ];

        for (const villa of villas) {
            const existing = await ctx.db
                .query("villas")
                .filter(q => q.eq(q.field("identifier"), villa.identifier))
                .first();

            if (!existing) {
                await ctx.db.insert("villas", villa);
            }
        }
        return "Seeded villas";
    },
});
