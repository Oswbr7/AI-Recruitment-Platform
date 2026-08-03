import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyContactApi } from "../services/CompanyContactApi";

export function useDeleteCompanyContact(companyId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (contactId: string) =>
            companyContactApi.remove(companyId, contactId),

        onSuccess: () => {

            toast.success("Contact deleted.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.contacts(companyId),
            });

        },

        onError: () => {

            toast.error("Unable to delete contact.");

        }

    });

}
