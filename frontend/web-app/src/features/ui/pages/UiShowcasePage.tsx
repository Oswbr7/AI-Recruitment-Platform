import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";
import { ButtonsSection } from "../sections/ButtonsSection";
import { CardsSection } from "../sections/CardsSection";
import { BadgesSection } from "../sections/BadgesSection";

export function UiShowcasePage() {

    return (

        <PageContainer>

            <PageHeader

                title="UI Showcase"

                description="Internal component library"

            />

            <div className="space-y-12">

                <ButtonsSection/>

                <CardsSection/>

                <BadgesSection/>

            </div>

        </PageContainer>

    );

}
