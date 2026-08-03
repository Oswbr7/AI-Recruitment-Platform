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
    companySchema,
    type CompanyFormValues,
} from "../../schemas/companySchema";

import { GeneralSection } from "./sections/GeneralSection";
import { ContactSection } from "./sections/ContactSection";
import { LocationSection } from "./sections/LocationSection";

interface CompanyFormProps {

    initialValues?: Partial<CompanyFormValues>;

    isSubmitting?: boolean;

    onCancel: () => void;

    onSubmit: (values: CompanyFormValues) => void | Promise<void>;

}

const defaultValues: CompanyFormValues = {

    name: "",

    industry: "",

    legalName: "",

    taxId: "",

    website: "",

    email: "",

    phone: "",

    description: "",

    logoUrl: "",

    companySize: "",

    foundedYear: undefined,

    country: "",

    state: "",

    city: "",

    address: "",

    postalCode: "",

};

export function CompanyForm({

    initialValues,

    isSubmitting = false,

    onCancel,

    onSubmit

}: CompanyFormProps) {

    const form = useForm<CompanyFormValues>({

        resolver: zodResolver(companySchema) as Resolver<CompanyFormValues>,

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

                    <ContactSection

                        control={form.control}

                    />

                    <LocationSection

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
