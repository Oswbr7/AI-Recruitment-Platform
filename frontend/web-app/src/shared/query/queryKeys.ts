export const queryKeys = {

    jobs: {

        all: ["jobs"] as const,

        list: (filters?: object) =>

            [...queryKeys.jobs.all, "list", filters] as const,

        detail: (id:string)=>

            [...queryKeys.jobs.all,"detail",id] as const,

    }

};