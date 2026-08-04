import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    EntitySheet,
    EntitySheetHeader,
    EntitySheetFooter,
} from "@/shared/components/entity";

import type { Interview } from "../../models/Interview";
import { useRescheduleInterview } from "../../hooks/useRescheduleInterview";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    interview: Interview;

}

function toPaddedDateParts(date: Date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {

        date: `${year}-${month}-${day}`,

        time: `${hours}:${minutes}`,

    };

}

export function RescheduleSheet({
    open,
    onOpenChange,
    interview,
}: Props) {

    const initial = toPaddedDateParts(interview.scheduledAt);

    const [date, setDate] = useState(initial.date);

    const [time, setTime] = useState(initial.time);

    const reschedule = useRescheduleInterview();

    const handleSave = () => {

        reschedule.mutate(
            {
                id: interview.id,
                scheduledAt: new Date(`${date}T${time}`).toISOString(),
            },
            { onSuccess: () => onOpenChange(false) }
        );

    };

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader
                title="Reschedule Interview"
                description={`Pick a new date and time for "${interview.title}".`}
            />

            <div className="flex-1 space-y-5 p-6">

                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={event => setDate(event.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                        type="time"
                        value={time}
                        onChange={event => setTime(event.target.value)}
                    />
                </div>

            </div>

            <EntitySheetFooter>

                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>

                <Button
                    disabled={!date || !time || reschedule.isPending}
                    onClick={handleSave}
                >
                    Save
                </Button>

            </EntitySheetFooter>

        </EntitySheet>

    );

}
