import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUrl = query({
    args: {storageid: v.id("_storage")},
    handler: async(ctx, {storageid} ) =>{
        return ctx.storage.getUrl(storageid);
    }
})