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

import type { CompanyFormValues } from "../../../schemas/companySchema";

interface Props {
    control: Control<CompanyFormValues>;
}

export function ContactSection({ control }: Props) {

    return (

        <FormSection
            title="Contact & Branding"
            description="How to reach this company and its logo."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="website"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Website</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://acme.example.com"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="logoUrl"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Logo URL</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="https://acme.example.com/logo.png"
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
                                        placeholder="contact@acme.example.com"
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
                                        placeholder="555-1000"
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
                    name="description"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Description</FormLabel>

                            <FormControl>

                                <Textarea
                                    rows={4}
                                    placeholder="What does this company do..."
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
