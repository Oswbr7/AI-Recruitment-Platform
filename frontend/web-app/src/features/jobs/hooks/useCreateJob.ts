import { useMutation } from "@tanstack/react-query";

import { jobApi } from "../../services/jobApi";

export function useCreateJob() {

    return useMutation({

        mutationFn: jobApi.create,

    });

}