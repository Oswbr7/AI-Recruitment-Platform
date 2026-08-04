import type { Interview } from "../../models/Interview";
import type { InterviewResponse } from "../dto/InterviewResponse";

export function toInterview(response: InterviewResponse): Interview {

    return {

        id: response.id,

        candidateId: response.candidateId,

        jobId: response.jobId,

        recruiterId: response.recruiterId,

        title: response.title,

        description: response.description ?? undefined,

        interviewType: response.interviewType as Interview["interviewType"],

        interviewStage: response.interviewStage as Interview["interviewStage"],

        scheduledAt: new Date(response.scheduledAt),

        durationMinutes: response.durationMinutes,

        meetingUrl: response.meetingUrl ?? undefined,

        location: response.location ?? undefined,

        status: response.status as Interview["status"],

        feedbackSubmitted: response.feedbackSubmitted,

        overallScore: response.overallScore ?? undefined,

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
