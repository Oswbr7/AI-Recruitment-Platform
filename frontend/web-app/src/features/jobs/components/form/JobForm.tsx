import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
    EntitySheetFooter,
} from "@/shared/components/entity";

import {
    FormActions,
} from "@/shared/components/form";

import {
    jobSchema,
    type JobFormValues,
} from "../../schemas/jobSchema";

import { DescriptionSection } from "./sections/DescriptionSection";
import { GeneralSection } from "./sections/GeneralSection";

interface JobFormProps {

    initialValues?: Partial<JobFormValues>;

    isSubmitting?: boolean;

    onCancel: () => void;

    onSubmit: (values: JobFormValues) => void | Promise<void>;

}

const defaultValues: JobFormValues = {

    title: "",

    department: "",

    location: "",

    description: "",

    employmentType: "",

    experienceLevel: "",

    remoteType: "",

    salaryMin: undefined,

    salaryMax: undefined,

    currency: "USD"

};

export function JobForm({

    initialValues,

    isSubmitting = false,

    onCancel,

    onSubmit

}: JobFormProps) {

    const form = useForm<JobFormValues>({

        resolver: zodResolver(jobSchema) as Resolver<JobFormValues>,

        defaultValues: {

            ...defaultValues,

            ...initialValues

        }

    });

    return (

        <Form {...form}>

            <form

                onSubmit={form.handleSubmit(onSubmit)}

                className="flex h-full flex-col"

            >

                <div className="flex-1 space-y-10 p-6">

                    <GeneralSection

                        control={form.control}

                    />

                    <DescriptionSection

                        control={form.control}

                    />

                </div>

                <EntitySheetFooter>

                    <FormActions

                        isSubmitting={isSubmitting}

                        onCancel={onCancel}

                    />

                </EntitySheetFooter>

            </form>

        </Form>

    );

}