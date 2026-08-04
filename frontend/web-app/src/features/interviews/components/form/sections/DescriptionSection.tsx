import type { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import { FormSection } from "@/shared/components/form";

import type { InterviewFormValues } from "../../../schemas/interviewSchema";

interface Props {
    control: Control<InterviewFormValues>;
}

export function DescriptionSection({ control }: Props) {

    return (

        <FormSection
            title="Description"
            description="Any additional notes for this interview."
        >

            <FormField
                control={control}
                name="description"
                render={({ field }) => (

                    <FormItem>

                        <FormLabel>Description</FormLabel>

                        <FormControl>

                            <Textarea
                                rows={4}
                                placeholder="Additional context..."
                                {...field}
                            />

                        </FormControl>

                        <FormMessage />

                    </FormItem>

                )}
            />

        </FormSection>

    );

}
