import type { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormSection } from "@/shared/components/form";

import type { CandidateFormValues } from "../../../schemas/candidateSchema";

interface Props {
    control: Control<CandidateFormValues>;
}

export function ProfileSection({ control }: Props) {

    return (

        <FormSection
            title="Professional Profile"
            description="Current role and background."
        >

            <div className="grid gap-5">

                <FormField
                    control={control}
                    name="headline"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Headline</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Senior Backend Developer"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="currentCompany"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Current Company</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Acme Inc."
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="currentPosition"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Current Position</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Backend Engineer"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                <FormField
                    control={control}
                    name="yearsOfExperience"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Years of Experience</FormLabel>

                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="5"
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
                    name="summary"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Summary</FormLabel>

                            <FormControl>

                                <Textarea
                                    rows={6}
                                    placeholder="Brief background and highlights..."
                                    {...field}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}
                />

            </div>

        </FormSection>

    );

}
