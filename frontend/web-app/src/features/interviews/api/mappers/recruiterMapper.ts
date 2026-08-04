import type { Recruiter } from "../../models/Recruiter";
import type { RecruiterResponse } from "../dto/RecruiterResponse";

export function toRecruiter(response: RecruiterResponse): Recruiter {

    return {

        id: response.id,

        firstName: response.firstName,

        lastName: response.lastName,

        email: response.email,

        role: response.role,

    };

}
