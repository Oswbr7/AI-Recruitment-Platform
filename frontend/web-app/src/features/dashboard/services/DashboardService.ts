export class DashboardService {
    static async getDashboard() {
        return {
            stats: {
                activeJobs: 18,
                candidates: 257,
                interviews: 42,
                aiScore: 91,
            },

            pipeline: [
                { stage: "Applied", value: 120 },
                { stage: "Screening", value: 75 },
                { stage: "Interview", value: 35 },
                { stage: "Offer", value: 12 },
                { stage: "Hired", value: 6 },
            ],

            recentCandidates: [
                {
                    id: 1,
                    name: "John Smith",
                    position: ".NET Developer",
                    score: 94,
                },
                {
                    id: 2,
                    name: "Maria Garcia",
                    position: "Frontend Developer",
                    score: 91,
                },
                {
                    id: 3,
                    name: "Carlos Perez",
                    position: "DevOps Engineer",
                    score: 87,
                },
            ],
        };
    }
}