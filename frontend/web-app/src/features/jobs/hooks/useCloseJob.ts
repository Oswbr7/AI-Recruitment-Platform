import { jobApi } from "../services/JobApi";
import { useJobStatusAction } from "./useJobStatusAction";

export function useCloseJob() {

    return useJobStatusAction(
        jobApi.close,
        "Job closed.",
        "Unable to close job."
    );

}
