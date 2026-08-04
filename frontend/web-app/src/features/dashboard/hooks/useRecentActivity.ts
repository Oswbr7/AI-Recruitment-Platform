import { useMemo } from "react";
import {
    Briefcase,
    Rocket,
    Archive,
    UserPlus,
    ArrowRightCircle,
    Building2,
    CalendarClock,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { JobStatus } from "@/features/jobs/models/Job";
import { CandidateStage } from "@/features/candidates/models/Candidate";
import { InterviewStatus } from "@/features/interviews/models/Interview";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";
import type { ActivityEvent } from "../models/DashboardModels";

export function useRecentActivity(limit = 15) {

    const { jobs, candidates, companies, interviews, isLoading } = useDashboardSourceData();

    const events = useMemo(() => {

        const items: ActivityEvent[] = [];

        for (const job of jobs) {

            items.push({
                id: `job-created-${job.id}`,
                type: "JobCreated",
                title: `Job "${job.title}" created`,
                createdAt: job.createdAt,
                icon: Briefcase,
                color: "text-blue-500",
            });

            if (job.publishedAt) {

                items.push({
                    id: `job-published-${job.id}`,
                    type: "JobPublished",
                    title: `Job "${job.title}" published`,
                    createdAt: job.publishedAt,
                    icon: Rocket,
                    color: "text-green-500",
                });

            }

            if (job.status === JobStatus.Archived) {

                items.push({
                    id: `job-archived-${job.id}`,
                    type: "JobArchived",
                    title: `Job "${job.title}" archived`,
                    createdAt: job.updatedAt,
                    icon: Archive,
                    color: "text-gray-500",
                });

            }

        }

        for (const candidate of candidates) {

            const name = `${candidate.firstName} ${candidate.lastName}`;

            items.push({
                id: `candidate-created-${candidate.id}`,
                type: "CandidateCreated",
                title: `${name} added as a candidate`,
                createdAt: candidate.createdAt,
                icon: UserPlus,
                color: "text-blue-500",
            });

            if (
                candidate.stage !== CandidateStage.Applied &&
                candidate.updatedAt.getTime() !== candidate.createdAt.getTime()
            ) {

                items.push({
                    id: `candidate-stage-${candidate.id}`,
                    type: "CandidateStageChanged",
                    title: `${name} moved to ${candidate.stage}`,
                    createdAt: candidate.updatedAt,
                    icon: ArrowRightCircle,
                    color: "text-purple-500",
                });

            }

        }

        for (const company of companies) {

            items.push({
                id: `company-created-${company.id}`,
                type: "CompanyCreated",
                title: `Company "${company.name}" created`,
                createdAt: company.createdAt,
                icon: Building2,
                color: "text-blue-500",
            });

        }

        for (const interview of interviews) {

            items.push({
                id: `interview-scheduled-${interview.id}`,
                type: "InterviewScheduled",
                title: `Interview "${interview.title}" scheduled`,
                createdAt: interview.createdAt,
                icon: CalendarClock,
                color: "text-blue-500",
            });

            if (interview.status === InterviewStatus.Completed) {

                items.push({
                    id: `interview-completed-${interview.id}`,
                    type: "InterviewCompleted",
                    title: `Interview "${interview.title}" completed`,
                    createdAt: interview.updatedAt,
                    icon: CheckCircle2,
                    color: "text-green-500",
                });

            }

            if (interview.status === InterviewStatus.Cancelled) {

                items.push({
                    id: `interview-cancelled-${interview.id}`,
                    type: "InterviewCancelled",
                    title: `Interview "${interview.title}" cancelled`,
                    createdAt: interview.updatedAt,
                    icon: XCircle,
                    color: "text-red-500",
                });

            }

        }

        return items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);

    }, [jobs, candidates, companies, interviews, limit]);

    return { events, isLoading };

}
