import { z } from "zod";

export const interviewSchema = z.object({

    candidateId: z
        .string()
        .min(1, "Candidate is required"),

    jobId: z
        .string()
        .min(1, "Job is required"),

    recruiterId: z
        .string()
        .min(1, "Recruiter is required"),

    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(200),

    description: z.string().trim().optional(),

    interviewType: z
        .string()
        .min(1, "Interview type is required"),

    interviewStage: z
        .string()
        .min(1, "Interview stage is required"),

    date: z
        .string()
        .min(1, "Date is required"),

    time: z
        .string()
        .min(1, "Time is required"),

    durationMinutes: z.coerce.number().min(1, "Duration must be greater than 0"),

    meetingUrl: z.string().trim().max(300).optional(),

    location: z.string().trim().max(300).optional(),

});

export type InterviewFormValues = z.infer<typeof interviewSchema>;
