import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";
import type { GetInterviewsParams } from "../types/GetInterviewsParams";

export function useInterviews(params: GetInterviewsParams) {

    return useQuery({

        queryKey: queryKeys.interviews.list(params),

        queryFn: () => interviewApi.getPaged(params),

        placeholderData: keepPreviousData,

    });

}
