import { query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) =>{
        return await ctx.db
            .query("events")
            .filter((query) => query.eq(query.field("is_cancelled"), undefined))
            .collect();
    },
});