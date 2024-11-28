"user client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export default function EventsCard({eventId}: {eventId: Id<"events">}) {
    const {user} = useUser();
    const router = useRouter();
    const event = useQuery(api.events.getById, {eventId});
    const availability = useQuery(api.events.getEventAvailability, {eventId});
    const userTicket = useQuery(api.tickets.getUserTicketEvent, {
        eventId,
        userId: user?.id ?? "",
    })
    const queuePosition = useQuery(api.waitingList.getQueuePosition, {
        eventId,
        userId: user?.id ?? "",
    })

    const imageUrl = useStorageUrl(event?.imageStorageId);
    
  return (
    <></>
  )
}
