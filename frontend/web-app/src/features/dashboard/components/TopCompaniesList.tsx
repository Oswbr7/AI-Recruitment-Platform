import { Building2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import type { Company } from "@/features/companies/models/Company";

type Props = {
    companies: {
        company: Company;
        openJobs: number;
    }[];
};

export function TopCompaniesList({ companies }: Props) {

    return (

        <Card>

            <CardHeader>
                <CardTitle>Top Companies</CardTitle>
            </CardHeader>

            <CardContent>

                {companies.length === 0 ? (

                    <EmptyState
                        title="No companies yet"
                        description="Companies with the most open jobs will appear here."
                    />

                ) : (

                    <ul className="space-y-4">

                        {companies.map(({ company, openJobs }) => (

                            <li key={company.id} className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <Avatar size="sm">
                                        <AvatarImage src={company.logoUrl} alt={company.name} />
                                        <AvatarFallback>
                                            <Building2 className="h-3.5 w-3.5" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>

                                        <p className="text-sm font-medium">{company.name}</p>

                                        <p className="text-xs text-muted-foreground">{company.industry}</p>

                                    </div>

                                </div>

                                <span className="text-sm font-medium text-muted-foreground">
                                    {openJobs} open job{openJobs === 1 ? "" : "s"}
                                </span>

                            </li>

                        ))}

                    </ul>

                )}

            </CardContent>

        </Card>

    );

}
