import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, {userId, name, email}) =>{
        //? check if user exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_user_id", (query) => query.eq("userId", userId)) //eq = equal
            .first();

        if (existingUser) {
            
            //? update existing user
            await ctx.db.patch(existingUser._id, {
                name,
                email,
            });
            return existingUser._id;
        }

        //? create new user
        const newUserId = await ctx.db.insert("users", {
            userId, 
            name,
            email,
            stripeConnectId: undefined,
        });
        return newUserId;
    }
})