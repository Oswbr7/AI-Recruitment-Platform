import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";

export function useDeleteInterview() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => interviewApi.remove(id),

        onSuccess: () => {

            toast.success("Interview deleted successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.all,
            });

        },

        onError: () => {

            toast.error("Unable to delete interview.");

        }

    });

}
