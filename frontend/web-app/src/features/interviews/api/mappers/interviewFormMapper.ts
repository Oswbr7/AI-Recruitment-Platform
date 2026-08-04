import type { InterviewFormValues } from "../../schemas/interviewSchema";
import type { ScheduleInterviewRequest } from "../../types/ScheduleInterviewRequest";
import type { UpdateInterviewRequest } from "../../types/UpdateInterviewRequest";
import type { Interview } from "../../models/Interview";

function toPaddedDateParts(date: Date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {

        date: `${year}-${month}-${day}`,

        time: `${hours}:${minutes}`,

    };

}

export function toScheduleInterviewRequest(values: InterviewFormValues): ScheduleInterviewRequest {

    return {

        candidateId: values.candidateId,

        jobId: values.jobId,

        recruiterId: values.recruiterId,

        title: values.title,

        description: values.description || undefined,

        interviewType: values.interviewType,

        interviewStage: values.interviewStage,

        scheduledAt: new Date(`${values.date}T${values.time}`).toISOString(),

        durationMinutes: values.durationMinutes,

        meetingUrl: values.meetingUrl || undefined,

        location: values.location || undefined,

    };

}

export function toUpdateInterviewRequest(values: InterviewFormValues): UpdateInterviewRequest {

    return {

        title: values.title,

        description: values.description || undefined,

        interviewType: values.interviewType,

        interviewStage: values.interviewStage,

        durationMinutes: values.durationMinutes,

        meetingUrl: values.meetingUrl || undefined,

        location: values.location || undefined,

    };

}

export function toInterviewFormValues(interview: Interview): InterviewFormValues {

    const { date, time } = toPaddedDateParts(interview.scheduledAt);

    return {

        candidateId: interview.candidateId,

        jobId: interview.jobId,

        recruiterId: interview.recruiterId,

        title: interview.title,

        description: interview.description ?? "",

        interviewType: interview.interviewType,

        interviewStage: interview.interviewStage,

        date,

        time,

        durationMinutes: interview.durationMinutes,

        meetingUrl: interview.meetingUrl ?? "",

        location: interview.location ?? "",

    };

}
