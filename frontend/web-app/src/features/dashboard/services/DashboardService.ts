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

            upcomingInterviews: [
                {
                    id: 1,
                    candidate: "John Smith",
                    date: "Today 10:00 AM",
                },
                {
                    id: 2,
                    candidate: "Maria Garcia",
                    date: "Today 2:00 PM",
                },
                {
                    id: 3,
                    candidate: "Carlos Perez",
                    date: "Tomorrow 9:00 AM",
                },
            ],
        };
    }
}