export interface GetJobsParams {
    page?: number;

    pageSize?: number;

    search?: string;

    status?: string;

    companyId?: string;

    sortBy?: string;

    sortDirection?: string;
}
