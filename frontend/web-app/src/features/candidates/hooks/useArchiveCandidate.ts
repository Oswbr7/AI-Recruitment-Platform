import { candidateApi } from "../services/CandidateApi";
import { useCandidateStatusAction } from "./useCandidateStatusAction";

export function useArchiveCandidate() {

    return useCandidateStatusAction(
        candidateApi.archive,
        "Candidate archived.",
        "Unable to archive candidate."
    );

}
