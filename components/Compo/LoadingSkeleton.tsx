import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
    const fakeData = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="space-y-4 grid sm:grid-cols-4 justify-center items-center">
      {fakeData.map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-3 p-4 rounded-lg">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
    
  )
}

