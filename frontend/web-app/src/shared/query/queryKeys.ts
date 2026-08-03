export const queryKeys = {

    jobs: {

        all: ["jobs"] as const,

        list: (filters?: object) =>

            [...queryKeys.jobs.all, "list", filters] as const,

        detail: (id:string)=>

            [...queryKeys.jobs.all,"detail",id] as const,

    },

    candidates: {

        all: ["candidates"] as const,

        list: (filters?: object) =>

            [...queryKeys.candidates.all, "list", filters] as const,

        detail: (id: string) =>

            [...queryKeys.candidates.all, "detail", id] as const,

        notes: (candidateId: string) =>

            [...queryKeys.candidates.detail(candidateId), "notes"] as const,

    },

    companies: {

        all: ["companies"] as const,

        list: (filters?: object) =>

            [...queryKeys.companies.all, "list", filters] as const,

        detail: (id: string) =>

            [...queryKeys.companies.all, "detail", id] as const,

        contacts: (companyId: string) =>

            [...queryKeys.companies.detail(companyId), "contacts"] as const,

    }

};