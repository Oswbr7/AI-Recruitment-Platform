import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CompanyStatus, type Company } from "../../models/Company";
import type { CompanyContact } from "../../models/CompanyContact";
import { JobStatus, type Job } from "@/features/jobs/models/Job";

interface TimelineEvent {

    id: string;

    label: string;

    at: Date;

}

interface Props {

    company: Company;

    contacts: CompanyContact[];

    jobs: Job[];

}

export function CompanyTimeline({
    company,
    contacts,
    jobs,
}: Props) {

    const events: TimelineEvent[] = [

        { id: "created", label: "Company Created", at: company.createdAt },

        ...contacts.map(contact => ({
            id: `contact-${contact.id}`,
            label: `Contact Added: ${contact.firstName} ${contact.lastName}`,
            at: contact.createdAt,
        })),

        ...jobs.map(job => ({
            id: `job-created-${job.id}`,
            label: `Job Created: ${job.title}`,
            at: job.createdAt,
        })),

        ...jobs
            .filter(job => job.status === JobStatus.Archived)
            .map(job => ({
                id: `job-archived-${job.id}`,
                label: `Job Archived: ${job.title}`,
                at: job.updatedAt,
            })),

    ];

    if (company.updatedAt.getTime() !== company.createdAt.getTime()) {

        events.push({ id: "updated", label: "Company Updated", at: company.updatedAt });

    }

    if (company.status === CompanyStatus.Archived) {

        events.push({ id: "archived", label: "Archived", at: company.updatedAt });

    }

    events.sort((a, b) => b.at.getTime() - a.at.getTime());

    return (

        <Card>

            <CardHeader>
                <CardTitle>Timeline</CardTitle>
            </CardHeader>

            <CardContent>

                <ul className="space-y-4">

                    {events.map(event => (

                        <li key={event.id} className="border-l-2 border-muted pl-4">

                            <p className="text-sm font-medium">{event.label}</p>

                            <p className="text-xs text-muted-foreground">
                                {event.at.toLocaleString()}
                            </p>

                        </li>

                    ))}

                </ul>

            </CardContent>

        </Card>

    );

}
