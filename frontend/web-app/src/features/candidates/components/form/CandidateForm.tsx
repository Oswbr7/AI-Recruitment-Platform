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
    candidateSchema,
    type CandidateFormValues,
} from "../../schemas/candidateSchema";

import { PersonalSection } from "./sections/PersonalSection";
import { ProfileSection } from "./sections/ProfileSection";
import { LinksAndCompensationSection } from "./sections/LinksAndCompensationSection";

interface CandidateFormProps {

    initialValues?: Partial<CandidateFormValues>;

    isSubmitting?: boolean;

    onCancel: () => void;

    onSubmit: (values: CandidateFormValues) => void | Promise<void>;

}

const defaultValues: CandidateFormValues = {

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    location: "",

    headline: "",

    summary: "",

    linkedInUrl: "",

    githubUrl: "",

    portfolioUrl: "",

    currentCompany: "",

    currentPosition: "",

    yearsOfExperience: undefined,

    expectedSalary: undefined,

    currency: "USD"

};

export function CandidateForm({

    initialValues,

    isSubmitting = false,

    onCancel,

    onSubmit

}: CandidateFormProps) {

    const form = useForm<CandidateFormValues>({

        resolver: zodResolver(candidateSchema) as Resolver<CandidateFormValues>,

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

                    <PersonalSection

                        control={form.control}

                    />

                    <ProfileSection

                        control={form.control}

                    />

                    <LinksAndCompensationSection

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
