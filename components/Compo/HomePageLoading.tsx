import { CalendarDays } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function HomePageLoading() {
  const fakeData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover & Book tickets for amazing events
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">
              0 Upcoming Events
            </span>
          </div>
        </div>
      </div>
        <div className="min-h-[400px] flex items-center justify-center">
          {/* Loading skeleton */}
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
          {fakeData.map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-3 p-4 rounded-lg">
          <Skeleton className="h-[389.34px] w-[390px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
      </div>
      </div>
  )
}
