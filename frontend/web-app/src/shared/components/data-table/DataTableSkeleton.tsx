import { Skeleton } from "@/components/ui/skeleton";

interface Props {

    columns?: number;

    rows?: number;

}

export function DataTableSkeleton({
    columns = 5,
    rows = 6,
}: Props) {

    return (

        <div className="space-y-3">

            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-8 w-24" />
            </div>

            <div className="rounded-lg border">

                <div className="border-b p-3">

                    <div className="flex gap-4">

                        {Array.from({ length: columns }).map((_, index) => (
                            <Skeleton key={index} className="h-4 flex-1" />
                        ))}

                    </div>

                </div>

                {Array.from({ length: rows }).map((_, rowIndex) => (

                    <div key={rowIndex} className="border-b p-3 last:border-0">

                        <div className="flex gap-4">

                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Skeleton key={colIndex} className="h-4 flex-1" />
                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}
