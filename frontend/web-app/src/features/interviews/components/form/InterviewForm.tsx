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
    interviewSchema,
    type InterviewFormValues,
} from "../../schemas/interviewSchema";

import { CandidateSection } from "./sections/CandidateSection";
import { ScheduleSection } from "./sections/ScheduleSection";
import { DescriptionSection } from "./sections/DescriptionSection";

interface InterviewFormProps {

    initialValues?: Partial<InterviewFormValues>;

    isSubmitting?: boolean;

    onCancel: () => void;

    onSubmit: (values: InterviewFormValues) => void | Promise<void>;

}

const defaultValues: InterviewFormValues = {

    candidateId: "",

    jobId: "",

    recruiterId: "",

    title: "",

    description: "",

    interviewType: "",

    interviewStage: "",

    date: "",

    time: "",

    durationMinutes: 60,

    meetingUrl: "",

    location: "",

};

export function InterviewForm({

    initialValues,

    isSubmitting = false,

    onCancel,

    onSubmit

}: InterviewFormProps) {

    const form = useForm<InterviewFormValues>({

        resolver: zodResolver(interviewSchema) as Resolver<InterviewFormValues>,

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

                    <CandidateSection

                        control={form.control}

                    />

                    <ScheduleSection

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
