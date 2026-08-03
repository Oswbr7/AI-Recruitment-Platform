import {
    EntitySheet,
    EntitySheetHeader,
} from "@/shared/components/entity";

import { CompanyForm } from "../form";
import { useCreateCompany } from "../../hooks/useCreateCompany";
import { useUpdateCompany } from "../../hooks/useUpdateCompany";
import { useUpdateCompanyLogo } from "../../hooks/useUpdateCompanyLogo";
import { toCompanyFormValues } from "../../api/mappers/companyFormMapper";
import { companyApi } from "../../services/CompanyApi";
import type { Company } from "../../models/Company";

interface CompanySheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    company?: Company;

}

export function CompanySheet({

    open,

    onOpenChange,

    company,

}: CompanySheetProps) {

    const createMutation = useCreateCompany();

    const updateMutation = useUpdateCompany(company?.id ?? "");

    const updateLogoMutation = useUpdateCompanyLogo(company?.id ?? "");

    const isEditing = Boolean(company);

    const isSubmitting = isEditing
        ? updateMutation.isPending
        : createMutation.isPending;

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader

                title={isEditing ? "Edit Company" : "Create Company"}

                description={
                    isEditing
                        ? "Update this company's profile."
                        : "Add a new company."
                }

            />

            <CompanyForm

                initialValues={company ? toCompanyFormValues(company) : undefined}

                isSubmitting={isSubmitting}

                onCancel={() => onOpenChange(false)}

                onSubmit={async values => {

                    if (isEditing && company) {

                        await updateMutation.mutateAsync(values);

                        if (values.logoUrl !== (company.logoUrl ?? ""))
                            await updateLogoMutation.mutateAsync(values.logoUrl || undefined);

                    } else {

                        const created = await createMutation.mutateAsync(values);

                        if (values.logoUrl)
                            await companyApi.updateLogo(created.id, values.logoUrl);

                    }

                    onOpenChange(false);

                }}

            />

        </EntitySheet>

    );

}
