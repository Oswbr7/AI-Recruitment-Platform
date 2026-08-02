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

import type { JobFormValues } from "../../../schemas/jobSchema";

interface Props {
    control: Control<JobFormValues>;
}

export function DescriptionSection({ control }: Props) {

    return (

        <FormSection
            title="Description"
            description="Explain the responsibilities and objectives of the role."
        >

            <FormField
                control={control}
                name="description"
                render={({ field }) => (

                    <FormItem>

                        <FormLabel>Description</FormLabel>

                        <FormControl>

                            <Textarea
                                rows={10}
                                placeholder="Describe the position..."
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