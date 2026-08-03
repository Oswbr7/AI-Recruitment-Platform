import type { JobFormValues } from "../../schemas/jobSchema";
import type { CreateJobRequest } from "../../types/CreateJobRequest";
import type { UpdateJobRequest } from "../../types/UpdateJobRequest";
import type { Job } from "../../models/Job";

export function toCreateJobRequest(values: JobFormValues): CreateJobRequest {

    return {

        title: values.title,

        description: values.description,

        department: values.department,

        location: values.location,

        employmentType: values.employmentType,

        experienceLevel: values.experienceLevel,

        remoteType: values.remoteType,

        salaryMin: values.salaryMin,

        salaryMax: values.salaryMax,

        currency: values.currency,

        companyId: values.companyId || undefined,

    };

}

export function toUpdateJobRequest(values: JobFormValues): UpdateJobRequest {

    return toCreateJobRequest(values);

}

export function toJobFormValues(job: Job): JobFormValues {

    return {

        title: job.title,

        description: job.description,

        department: job.department,

        location: job.location,

        employmentType: job.employmentType ?? "",

        experienceLevel: job.experienceLevel ?? "",

        remoteType: job.remoteType ?? "",

        salaryMin: job.salaryMin,

        salaryMax: job.salaryMax,

        currency: job.currency,

        companyId: job.companyId ?? "",

    };

}
