import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constant";
import { internal } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .filter((query) => query.eq(query.field("is_cancelled"), undefined))
      .collect();
  },
});

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db.get(eventId);
  },
});

export const getEventAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not Found");

    // count total purchased tickets
    const purchasedCount = await ctx.db // count purchased offers
      .query("tickets")
      .withIndex("by_event", (query) => query.eq("eventId", eventId))
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (ticket) =>
              ticket.status === TICKET_STATUS.VALID ||
              ticket.status === TICKET_STATUS.USER
          ).length
      );

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
    };
  },
});

// helper function to check ticket availablity for an event
export const checkAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Entry not found");

    // count total purchase titckets
    const purchasedCount = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (t) =>
              t.status === TICKET_STATUS.VALID ||
              t.status === TICKET_STATUS.USERD
          ).length
      );

    // count current valid  offers
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

    const availableSpots = event.totalTickets - (purchasedCount + activeOffers);

    return {
      available: availableSpots > 0,
      availableSpots,
      totalTickets: event.totalTickets,
      purchasedCount,
      activeOffers,
    };
  },
});

// join waiting list for an event
export const joinWaitingList = mutation({
  // functin takes an event ID and user ID as arguments
  args: { eventId: v.id("events"), userId: v.string() },
  handler: async (ctx, { eventId, userId }) => {
    


    // first check if user already has an active entry in waiting list for this event
    // active means any status evept EXPIRED
    const existingEntry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
      .first();

    // Don't allow duplicate entires
    if (existingEntry)
      throw new Error("Already in waiting list for this event");

    //verify the event exists
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    //? check if are any available tickets right now
    const { available } = await checkAvailability(ctx, { eventId });

    const now = Date.now();

    if (available) {
      // if tickets are available, create an offer entry
      const waitingListId = await ctx.db.insert("waitingList", {
        eventId,
        userId,
        status: WAITING_LIST_STATUS.OFFERED, // mark as offered
        offerExpiresAt: now + DURATIONS.TICKET_OFFER,
      });

      // Schadule a job to expire this offer atfer the offer duration
      await ctx.scheduler.runAfter(
        DURATIONS.TICKET_OFFER,
        internal.waitingList.expireOffer,
        {
          waitingListId,
          eventId,
        }
      );
    } else {
      // is no tickets available, add to waiting list
      await ctx.db.insert("waitingList", {
        eventId,
        userId,
        status: WAITING_LIST_STATUS.WAITING, // mark as waiting
      });
    }

    // return appropiate status message
    return {
      success: true,
      status: available
        ? WAITING_LIST_STATUS.OFFERED // id available, status is offered
        : WAITING_LIST_STATUS.WAITINg, // if not available, stats is waiting
      message: available
        ? `Ticket offered - you have ${DURATIONS.TICKET_OFFER / (60 * 100)} minutes to purchase`
        : "Added to waiting list - you'll be notified when a ticket becomes available",
    };
  },
});
