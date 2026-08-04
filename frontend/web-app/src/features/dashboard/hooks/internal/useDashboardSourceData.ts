import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { useInterviews } from "@/features/interviews/hooks/useInterviews";

export function useDashboardSourceData() {

    const jobsQuery = useJobs();

    const candidatesQuery = useCandidates({ pageSize: 200 });

    const companiesQuery = useCompanies({ pageSize: 200 });

    const interviewsQuery = useInterviews({ pageSize: 200 });

    return {

        jobs: jobsQuery.data ?? [],

        candidates: candidatesQuery.data?.items ?? [],

        companies: companiesQuery.data?.items ?? [],

        interviews: interviewsQuery.data?.items ?? [],

        isLoading:
            jobsQuery.isLoading ||
            candidatesQuery.isLoading ||
            companiesQuery.isLoading ||
            interviewsQuery.isLoading,

        isError:
            jobsQuery.isError ||
            candidatesQuery.isError ||
            companiesQuery.isError ||
            interviewsQuery.isError,

    };

}
