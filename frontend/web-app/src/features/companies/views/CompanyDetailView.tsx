import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceholderSection } from "@/shared/components/PlaceholderSection";

import { JobTable } from "@/features/jobs/components/table/JobTable";
import { useJobs } from "@/features/jobs/hooks/useJobs";

import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { useCompanyContacts } from "../hooks/useCompanyContacts";
import { CompanyStatusBadge } from "../components/badges/CompanyStatusBadge";
import { CompanyActionsMenu } from "../components/actions/CompanyActionsMenu";
import { CompanySheet } from "../components/sheet";
import { CompanyTimeline } from "../components/timeline/CompanyTimeline";
import { CompanyContactsSection } from "../components/contacts/CompanyContactsSection";

interface Props {

    id: string;

}

export function CompanyDetailView({ id }: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const { data: company, isLoading, isError } = useCompanyDetail(id);

    const { data: contacts } = useCompanyContacts(id);

    const { data: jobs } = useJobs({ companyId: id });

    if (isLoading) {

        return (

            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-64 w-full" />
            </div>

        );

    }

    if (isError || !company) {

        return (

            <div className="space-y-4">

                <Button variant="ghost" onClick={() => navigate("/companies")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Companies
                </Button>

                <p className="text-sm text-muted-foreground">Company not found.</p>

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <Button variant="ghost" onClick={() => navigate("/companies")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Companies
                </Button>

                <div className="flex items-center gap-2">

                    <Button onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Edit
                    </Button>

                    <CompanyActionsMenu company={company} />

                </div>

            </div>

            <Card>

                <CardHeader>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <Avatar size="lg">
                                <AvatarImage src={company.logoUrl} alt={company.name} />
                                <AvatarFallback>
                                    <Building2 className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>

                            <CardTitle className="text-2xl">{company.name}</CardTitle>

                        </div>

                        <CompanyStatusBadge status={company.status} />

                    </div>

                </CardHeader>

                <CardContent className="space-y-6">

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailField label="Legal Name" value={company.legalName} />

                        <DetailField label="Tax ID" value={company.taxId} />

                        <DetailField label="Industry" value={company.industry} />

                        <DetailField label="Company Size" value={company.companySize} />

                        <DetailField label="Website" value={company.website} />

                        <DetailField label="Email" value={company.email} />

                        <DetailField label="Phone" value={company.phone} />

                        <DetailField label="Founded Year" value={company.foundedYear?.toString()} />

                        <DetailField
                            label="Location"
                            value={
                                [company.city, company.state, company.country]
                                    .filter(Boolean)
                                    .join(", ") || undefined
                            }
                        />

                        <DetailField label="Address" value={company.address} />

                        <DetailField label="Postal Code" value={company.postalCode} />

                    </div>

                    <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Description
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {company.description || "—"}
                        </p>

                    </div>

                </CardContent>

            </Card>

            <Card>

                <CardHeader>
                    <CardTitle>Open Jobs</CardTitle>
                </CardHeader>

                <CardContent>
                    <JobTable jobs={jobs ?? []} />
                </CardContent>

            </Card>

            <PlaceholderSection title="Recruiters" />

            <CompanyContactsSection companyId={company.id} />

            <CompanyTimeline
                company={company}
                contacts={contacts ?? []}
                jobs={jobs ?? []}
            />

            <CompanySheet
                company={company}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

        </div>

    );

}

function DetailField({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {

    return (

        <div>

            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <p className="mt-1 text-sm">{value || "—"}</p>

        </div>

    );

}
