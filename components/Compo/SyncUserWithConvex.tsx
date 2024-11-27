"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react";

export default function SyncUserWithConvex() {
    const {user} = useUser();
    console.log(user);

    useEffect(() =>{
        if(!user) return;
        // const updateUser = useMutation(api.user.updateUser)

        const syncUser = async() =>{
            try {
                await updateUser({
                    userId: user.id,
                    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
                    email: user.emailAddresses[0]?.emailAddress ?? "",
                })
            } catch (error) {
                console.error("Error syncing user: ", error);
            }
        };
        syncUser();
    },[user])
  return null;
}
