import { SectionCard } from "@/shared/components/cards/SectionCard";
import { StatusBadge } from "@/shared/StatusBadge";

export function BadgesSection() {

    return (

        <SectionCard title="Status Badges">

            <div className="flex gap-4">

                <StatusBadge variant="success">

                    Published

                </StatusBadge>

                <StatusBadge variant="warning">

                    Draft

                </StatusBadge>

                <StatusBadge variant="danger">

                    Closed

                </StatusBadge>

            </div>

        </SectionCard>

    );

}
