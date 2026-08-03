export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
