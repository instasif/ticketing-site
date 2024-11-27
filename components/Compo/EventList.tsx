"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import LoadingSkeleton from "./LoadingSkeleton";
import Spinner from "./Spinner";


export default function EventList() {
    const events = useQuery(api.events.get);
    console.log(events);

    if (!events) {
        <div className="min-h-[400px] fkex items-center justify-center">
            <LoadingSkeleton />
        </div>
    }
  return (
    <div>EventList</div>
  )
}
