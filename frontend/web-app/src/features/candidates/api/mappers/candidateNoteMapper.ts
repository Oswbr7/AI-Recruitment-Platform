import type { CandidateNote } from "../../models/CandidateNote";
import type { CandidateNoteResponse } from "../dto/CandidateNoteResponse";

export function toCandidateNote(response: CandidateNoteResponse): CandidateNote {

    return {

        id: response.id,

        candidateId: response.candidateId,

        content: response.content,

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
