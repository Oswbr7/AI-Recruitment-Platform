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

import { CompanySize, Industry } from "../../../models/Company";

import type { CompanyFormValues } from "../../../schemas/companySchema";

interface Props {
    control: Control<CompanyFormValues>;
}

export function GeneralSection({ control }: Props) {

    return (

        <FormSection
            title="General Information"
            description="Basic information about the company."
        >

            <div className="grid gap-5">

                <div className="grid md:grid-cols-2 gap-5">

                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Name</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Acme Corp"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="legalName"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Legal Name</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Acme Corporation LLC"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    <FormField
                        control={control}
                        name="taxId"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Tax ID</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="TAX-001"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={control}
                        name="industry"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Industry</FormLabel>

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

                                        {(Object.values(Industry) as Industry[]).map(value => (

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
                        name="companySize"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Company Size</FormLabel>

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

                                        {(Object.values(CompanySize) as CompanySize[]).map(value => (

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

                <FormField
                    control={control}
                    name="foundedYear"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Founded Year</FormLabel>

                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="2010"
                                    {...field}
                                    value={field.value ?? ""}
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
