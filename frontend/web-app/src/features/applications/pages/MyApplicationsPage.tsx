import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";
import { LoadingSpinner } from "@/shared/components/loading/LoadingSpinner";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useMyProfile } from "@/features/candidates/hooks/useMyProfile";

import { useMyApplications } from "../hooks/useApplications";
import { ApplicationsTable } from "../components/ApplicationsTable";
import { CreateMyProfileForm } from "../components/CreateMyProfileForm";

/**
 * "Mis aplicaciones" (rol Candidate): requiere perfil candidato propio.
 * Sin perfil: formulario de creación guiada. Con perfil: tarjeta de perfil
 * + aplicaciones (solo la acción Withdraw, espejo del dominio).
 */
export function MyApplicationsPage() {
    const { data: profile, isLoading: profileLoading } = useMyProfile();
    const { data: applicationsData, isLoading: applicationsLoading } = useMyApplications();
    const { data: jobs } = useJobs();

    const jobTitle = (id: string) => jobs?.find((j) => j.id === id)?.title ?? "Unknown";

    return (
        <PageContainer>
            <PageHeader
                title="My Applications"
                description="Track the status of your applications and withdraw if you change your mind."
            />

            {profileLoading ? (
                <LoadingSpinner />
            ) : !profile ? (
                <div className="max-w-md">
                    <h2 className="mb-4 text-lg font-semibold">Create your candidate profile</h2>

                    <p className="mb-6 text-sm text-muted-foreground">
                        You need a profile before applying to jobs. It takes less than a minute.
                    </p>

                    <CreateMyProfileForm />
                </div>
            ) : (
                <>
                    <div className="mb-8 max-w-md rounded-lg border p-6">
                        <h2 className="mb-4 text-lg font-semibold">My profile</h2>

                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="font-medium">
                                    {profile.firstName} {profile.lastName}
                                </dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd className="font-medium">{profile.email}</dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Headline</dt>
                                <dd className="font-medium">{profile.headline ?? "—"}</dd>
                            </div>
                        </dl>
                    </div>

                    <ApplicationsTable
                        applications={applicationsData?.items}
                        isLoading={applicationsLoading}
                        jobTitle={jobTitle}
                        actionsMode="candidate"
                        emptyTitle="No applications yet"
                        emptyDescription="Browse the job board and apply from any job's detail page."
                    />
                </>
            )}
        </PageContainer>
    );
}
