import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";

export function useInterviewDetail(id: string) {

    return useQuery({

        queryKey: queryKeys.interviews.detail(id),

        queryFn: () => interviewApi.getById(id),

        enabled: Boolean(id),

    });

}
