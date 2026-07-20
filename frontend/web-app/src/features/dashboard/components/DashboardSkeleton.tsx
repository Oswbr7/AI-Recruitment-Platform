import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">

            <Skeleton className="h-10 w-72" />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {[1,2,3,4].map(item => (
                    <Skeleton
                        key={item}
                        className="h-36 rounded-xl"
                    />
                ))}

            </div>

            <Skeleton className="h-80 rounded-xl" />

        </div>
    );
}