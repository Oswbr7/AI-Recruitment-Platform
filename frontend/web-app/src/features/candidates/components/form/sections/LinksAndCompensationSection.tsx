import type { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { FormSection } from "@/shared/components/form";

import type { CandidateFormValues } from "../../../schemas/candidateSchema";

interface Props {
    control: Control<CandidateFormValues>;
}

export function LinksAndCompensationSection({ control }: Props) {

    return (

        <FormSection
            title="Links & Compensation"
            description="Online profiles and salary expectations."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-3 gap-5">

                    <FormField
                        control={control}
                        name="linkedInUrl"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>LinkedIn</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://linkedin.com/in/..."
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="githubUrl"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>GitHub</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://github.com/..."
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="portfolioUrl"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Portfolio</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://..."
                                        {...field}
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
                        name="expectedSalary"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Expected Salary</FormLabel>

                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="60000"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="currency"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Currency</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="USD"
                                        maxLength={3}
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
