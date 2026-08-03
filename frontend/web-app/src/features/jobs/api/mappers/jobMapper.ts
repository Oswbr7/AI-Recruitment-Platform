import type { Job } from "../../models/Job";
import type { JobResponse } from "../dto/JobResponse";

export function toJob(response: JobResponse): Job {

    return {

        id: response.id,

        title: response.title,

        description: response.description,

        department: response.department,

        location: response.location,

        status: response.status as Job["status"],

        employmentType: response.employmentType as Job["employmentType"],

        experienceLevel: response.experienceLevel as Job["experienceLevel"],

        remoteType: response.remoteType as Job["remoteType"],

        salaryMin: response.salaryMin ?? undefined,

        salaryMax: response.salaryMax ?? undefined,

        currency: response.currency ?? undefined,

        companyId: response.companyId ?? undefined,

        publishedAt: response.publishedAt ? new Date(response.publishedAt) : undefined,

        closedAt: response.closedAt ? new Date(response.closedAt) : undefined,

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
