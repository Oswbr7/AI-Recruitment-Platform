import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyContactApi } from "../services/CompanyContactApi";
import type { UpdateCompanyContactRequest } from "../types/UpdateCompanyContactRequest";

interface UpdateCompanyContactVariables {

    contactId: string;

    request: UpdateCompanyContactRequest;

}

export function useUpdateCompanyContact(companyId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ contactId, request }: UpdateCompanyContactVariables) =>
            companyContactApi.update(companyId, contactId, request),

        onSuccess: () => {

            toast.success("Contact updated.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.contacts(companyId),
            });

        },

        onError: () => {

            toast.error("Unable to update contact.");

        }

    });

}
