import { Control } from "react-hook-form";

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

import {
    EmploymentType,
    ExperienceLevel,
    RemoteType,
} from "../../types/job";

import { JobFormValues } from "../../schemas/jobSchema";

interface Props {
    control: Control<JobFormValues>;
}

export function GeneralSection({ control }: Props) {

    return (

        <FormSection
            title="General Information"
            description="Basic information about the position."
        >

            <div className="grid gap-5">

                <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Title</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Senior .NET Developer"
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
                        name="department"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Department</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Engineering"
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
                                        placeholder="Guadalajara, MX"
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
                        name="employmentType"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Employment</FormLabel>

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

                                        {Object.values(EmploymentType).map(type => (

                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type}
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
                        name="experienceLevel"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Experience</FormLabel>

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

                                        {Object.values(ExperienceLevel).map(level => (

                                            <SelectItem
                                                key={level}
                                                value={level}
                                            >
                                                {level}
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
                        name="remoteType"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Remote</FormLabel>

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

                                        {Object.values(RemoteType).map(type => (

                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </SelectItem>

                                        ))}

                                    </SelectContent>

                                </Select>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

            </div>

        </FormSection>

    );

}