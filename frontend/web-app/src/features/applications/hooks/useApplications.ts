import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";

import {
    applicationsApi,
    type ApplicationTransition,
    type GetApplicationsParams,
} from "../services/ApplicationsApi";

export function useApplications(params: GetApplicationsParams) {
    const merged = { page: 1, pageSize: 100, ...params };

    return useQuery({
        queryKey: queryKeys.applications.list(merged),
        queryFn: () => applicationsApi.getPaged(merged),
    });
}

export function useSubmitApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: applicationsApi.submit,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
    });
}

export function useApplicationTransition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, transition }: { id: string; transition: ApplicationTransition }) =>
            applicationsApi.transition(id, transition),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
    });
}
