import { jobApi } from "../services/JobApi";
import { useJobStatusAction } from "./useJobStatusAction";

export function useReopenJob() {

    return useJobStatusAction(
        jobApi.reopen,
        "Job reopened.",
        "Unable to reopen job."
    );

}
