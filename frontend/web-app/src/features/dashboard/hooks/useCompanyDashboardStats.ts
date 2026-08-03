import { useMemo } from "react";

import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { CompanyStatus } from "@/features/companies/models/Company";
import { useJobs } from "@/features/jobs/hooks/useJobs";

export function useCompanyDashboardStats() {

    const { data: companiesData, isLoading: companiesLoading } = useCompanies({ pageSize: 200 });

    const { data: jobs, isLoading: jobsLoading } = useJobs();

    const stats = useMemo(() => {

        const companies = companiesData?.items ?? [];

        const activeCount = companies.filter(c => c.status === CompanyStatus.Active).length;

        const archivedCount = companies.filter(c => c.status === CompanyStatus.Archived).length;

        const byIndustryMap = new Map<string, number>();

        const bySizeMap = new Map<string, number>();

        for (const company of companies) {

            byIndustryMap.set(company.industry, (byIndustryMap.get(company.industry) ?? 0) + 1);

            if (company.companySize)
                bySizeMap.set(company.companySize, (bySizeMap.get(company.companySize) ?? 0) + 1);

        }

        const openJobsByCompany = new Map<string, number>();

        for (const job of jobs ?? []) {

            if (job.companyId)
                openJobsByCompany.set(job.companyId, (openJobsByCompany.get(job.companyId) ?? 0) + 1);

        }

        const topCompanies = [...companies]
            .map(company => ({ company, openJobs: openJobsByCompany.get(company.id) ?? 0 }))
            .sort((a, b) => b.openJobs - a.openJobs)
            .slice(0, 5);

        return {

            activeCount,

            archivedCount,

            byIndustry: Array.from(byIndustryMap.entries()).map(([industry, value]) => ({ industry, value })),

            bySize: Array.from(bySizeMap.entries()).map(([size, value]) => ({ size, value })),

            topCompanies,

        };

    }, [companiesData, jobs]);

    return {

        ...stats,

        isLoading: companiesLoading || jobsLoading,

    };

}
