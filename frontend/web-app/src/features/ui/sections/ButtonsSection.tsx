import { Button } from "@/components/ui/button";
import { SectionCard } from "@/shared/components/cards/SectionCard";

export function ButtonsSection(){

    return(

        <SectionCard title="Buttons">

            <div className="flex gap-4">

                <Button>

                    Primary

                </Button>

                <Button variant="secondary">

                    Secondary

                </Button>

                <Button variant="outline">

                    Outline

                </Button>

            </div>

        </SectionCard>

    );

}