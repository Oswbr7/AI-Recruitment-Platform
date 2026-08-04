import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { recruiterApi } from "../services/RecruiterApi";

export function useRecruiters() {

    return useQuery({

        queryKey: queryKeys.recruiters.all,

        queryFn: recruiterApi.getAll,

    });

}
