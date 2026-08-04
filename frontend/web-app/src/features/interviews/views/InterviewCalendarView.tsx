import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useInterviews } from "../hooks/useInterviews";
import type { Interview } from "../models/Interview";
import { CalendarDayCell } from "../components/calendar/CalendarDayCell";

const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function InterviewCalendarView() {

    const navigate = useNavigate();

    const [currentMonth, setCurrentMonth] = useState(() => new Date());

    const monthStart = startOfMonth(currentMonth);

    const monthEnd = endOfMonth(currentMonth);

    const gridStart = startOfWeek(monthStart);

    const gridEnd = endOfWeek(monthEnd);

    const days = useMemo(
        () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
        [gridStart, gridEnd]
    );

    const { data, isLoading, isError } = useInterviews({
        dateFrom: gridStart.toISOString(),
        dateTo: gridEnd.toISOString(),
        pageSize: 200,
    });

    const interviewsByDay = useMemo(() => {

        const map = new Map<string, Interview[]>();

        for (const interview of data?.items ?? []) {

            const key = format(interview.scheduledAt, "yyyy-MM-dd");

            const existing = map.get(key) ?? [];

            existing.push(interview);

            map.set(key, existing);

        }

        return map;

    }, [data]);

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold tracking-tight">Interview Calendar</h1>

                    <p className="text-muted-foreground">Browse scheduled interviews by month.</p>

                </div>

                <Button variant="outline" onClick={() => navigate("/interviews")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Interviews
                </Button>

            </div>

            <div className="flex items-center justify-between">

                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>

                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>

            </div>

            {isLoading ? (

                <Skeleton className="h-[600px] w-full" />

            ) : isError ? (

                <div className="flex flex-col items-center py-20 text-center">

                    <h3 className="text-xl font-semibold">Unable to load the calendar</h3>

                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>

                </div>

            ) : (

                <div className="overflow-hidden rounded-lg border">

                    <div className="grid grid-cols-7 border-b bg-muted/50">

                        {weekDayLabels.map(label => (

                            <div key={label} className="border-r p-2 text-center text-xs font-medium text-muted-foreground last:border-r-0">
                                {label}
                            </div>

                        ))}

                    </div>

                    <div className="grid grid-cols-7">

                        {days.map(day => (

                            <CalendarDayCell
                                key={day.toISOString()}
                                date={day}
                                isCurrentMonth={isSameMonth(day, currentMonth)}
                                isToday={isToday(day)}
                                interviews={interviewsByDay.get(format(day, "yyyy-MM-dd")) ?? []}
                            />

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}
