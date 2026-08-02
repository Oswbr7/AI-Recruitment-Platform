import { jobApi } from "../services/JobApi";
import { useJobStatusAction } from "./useJobStatusAction";

export function usePublishJob() {

    return useJobStatusAction(
        jobApi.publish,
        "Job published.",
        "Unable to publish job."
    );

}
