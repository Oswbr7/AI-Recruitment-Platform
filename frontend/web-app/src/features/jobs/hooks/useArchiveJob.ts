import { jobApi } from "../services/JobApi";
import { useJobStatusAction } from "./useJobStatusAction";

export function useArchiveJob() {

    return useJobStatusAction(
        jobApi.archive,
        "Job archived.",
        "Unable to archive job."
    );

}
