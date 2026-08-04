import type { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { FormSection } from "@/shared/components/form";

import { InterviewStage, InterviewType } from "../../../models/Interview";

import type { InterviewFormValues } from "../../../schemas/interviewSchema";

interface Props {
    control: Control<InterviewFormValues>;
}

export function ScheduleSection({ control }: Props) {

    return (

        <FormSection
            title="Schedule"
            description="When and how the interview takes place."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="interviewType"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Interview Type</FormLabel>

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >

                                    <FormControl>

                                        <SelectTrigger>

                                            <SelectValue placeholder="Select"/>

                                        </SelectTrigger>

                                    </FormControl>

                                    <SelectContent>

                                        {(Object.values(InterviewType) as InterviewType[]).map(value => (

                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {value}
                                            </SelectItem>

                                        ))}

                                    </SelectContent>

                                </Select>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="interviewStage"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Interview Stage</FormLabel>

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >

                                    <FormControl>

                                        <SelectTrigger>

                                            <SelectValue placeholder="Select"/>

                                        </SelectTrigger>

                                    </FormControl>

                                    <SelectContent>

                                        {(Object.values(InterviewStage) as InterviewStage[]).map(value => (

                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {value}
                                            </SelectItem>

                                        ))}

                                    </SelectContent>

                                </Select>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    <FormField
                        control={control}
                        name="date"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Date</FormLabel>

                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="time"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Time</FormLabel>

                                <FormControl>
                                    <Input
                                        type="time"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="durationMinutes"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Duration (min)</FormLabel>

                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="60"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="meetingUrl"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Meeting URL</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://meet.example.com/..."
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Location</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Office, Room 3"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

            </div>

        </FormSection>

    );

}
