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

import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useRecruiters } from "../../../hooks/useRecruiters";

import type { InterviewFormValues } from "../../../schemas/interviewSchema";

interface Props {
    control: Control<InterviewFormValues>;
}

export function CandidateSection({ control }: Props) {

    const { data: candidatesData } = useCandidates({ pageSize: 200 });

    const { data: jobs } = useJobs();

    const { data: recruiters } = useRecruiters();

    return (

        <FormSection
            title="Participants"
            description="Who this interview is for and who is running it."
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
                                    placeholder="Technical Interview - Backend Role"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                <FormField
                    control={control}
                    name="candidateId"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Candidate</FormLabel>

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

                                    {(candidatesData?.items ?? []).map(candidate => (

                                        <SelectItem
                                            key={candidate.id}
                                            value={candidate.id}
                                        >
                                            {candidate.firstName} {candidate.lastName}
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
                    name="jobId"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Job</FormLabel>

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

                                    {(jobs ?? []).map(job => (

                                        <SelectItem
                                            key={job.id}
                                            value={job.id}
                                        >
                                            {job.title}
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
                    name="recruiterId"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>Recruiter</FormLabel>

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

                                    {(recruiters ?? []).map(recruiter => (

                                        <SelectItem
                                            key={recruiter.id}
                                            value={recruiter.id}
                                        >
                                            {recruiter.firstName} {recruiter.lastName}
                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                            <FormMessage />

                        </FormItem>

                    )}
                />

            </div>

        </FormSection>

    );

}
