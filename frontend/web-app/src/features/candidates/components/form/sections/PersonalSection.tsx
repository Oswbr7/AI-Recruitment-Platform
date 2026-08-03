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

export function PersonalSection({ control }: Props) {

    return (

        <FormSection
            title="Personal Information"
            description="Basic contact information for the candidate."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>First Name</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Ana"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Last Name</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Garcia"
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
                        name="email"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Email</FormLabel>

                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="ana.garcia@example.com"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Phone</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="555-1111"
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
                    name="location"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Location</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Madrid, Spain"
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
