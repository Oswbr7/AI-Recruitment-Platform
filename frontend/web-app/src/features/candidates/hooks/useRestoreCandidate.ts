import { candidateApi } from "../services/CandidateApi";
import { useCandidateStatusAction } from "./useCandidateStatusAction";

export function useRestoreCandidate() {

    return useCandidateStatusAction(
        candidateApi.restore,
        "Candidate restored.",
        "Unable to restore candidate."
    );

}
