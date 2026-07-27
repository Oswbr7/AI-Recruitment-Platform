import { Job } from "../../models/Job";
import { JobResponse } from "../dto/JobResponse";

export function toJob(response: JobResponse): Job {

    return {

        id: response.id,

        title: response.title,

        department: response.department,

        location: response.location,

        description: response.description,

        status: response.status as Job["status"],

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}