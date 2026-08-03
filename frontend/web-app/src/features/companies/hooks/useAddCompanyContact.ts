import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyContactApi } from "../services/CompanyContactApi";
import type { AddCompanyContactRequest } from "../types/AddCompanyContactRequest";

export function useAddCompanyContact(companyId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (request: AddCompanyContactRequest) =>
            companyContactApi.add(companyId, request),

        onSuccess: () => {

            toast.success("Contact added.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.contacts(companyId),
            });

        },

        onError: () => {

            toast.error("Unable to add contact.");

        }

    });

}
