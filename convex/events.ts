import { v } from "convex/values";
import { query } from "./_generated/server";
import { TICKET_STATUS, WAITING_LIST_STATUS } from "./constant";

export const get = query({
    args: {},
    handler: async (ctx) =>{
        return await ctx.db
            .query("events")
            .filter((query) => query.eq(query.field("is_cancelled"), undefined))
            .collect();
    },
});

export const getById = query({
    args: {eventId: v.id("events")},
    handler: async (ctx, {eventId}) =>{
        return await ctx.db.get(eventId);
    },
})

export const getEventAvailability = query({
    args: { eventId: v.id("events") },
    handler: async(ctx, {eventId}) =>{
        const event = await ctx.db.get(eventId);
        if (!event) throw new Error("Event not Found");

        // count total purchased tickets
        const purchasedCount = await ctx.db // count purchased offers
            .query("tickets")
            .withIndex("by_event", (query) => query.eq("eventId", eventId))
            .collect()
            .then((tickets) => tickets.filter(
                (ticket) => 
                    ticket.status === TICKET_STATUS.VALID ||
                    ticket.status === TICKET_STATUS.USER
            ).length
        )

        // count active offers
        const now = Date.now();
        const activeOffers = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (q) =>
                q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
            )
            .collect()
            .then(
                (entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
            );
            const totalReserved = purchasedCount + activeOffers;

            return {
                isSoldOut: totalReserved >= event.totalTickets,
                totalTickets: event.totalTickets,
                purchasedCount,
                activeOffers,
                remainingTickets: Math.max(0, event.totalTickets + totalReserved),
            }
    }
})