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

import type { CompanyFormValues } from "../../../schemas/companySchema";

interface Props {
    control: Control<CompanyFormValues>;
}

export function LocationSection({ control }: Props) {

    return (

        <FormSection
            title="Location"
            description="Where this company is based."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-3 gap-5">

                    <FormField
                        control={control}
                        name="country"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Country</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="USA"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="state"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>State</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="CA"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="city"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>City</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="San Francisco"
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
                        name="address"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Address</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="123 Market St"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="postalCode"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Postal Code</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="94105"
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
