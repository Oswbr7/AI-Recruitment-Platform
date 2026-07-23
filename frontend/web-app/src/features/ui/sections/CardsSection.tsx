import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SectionCard } from "@/shared/components/cards/SectionCard";

export function CardsSection() {

    return (

        <SectionCard title="Cards">

            <div className="grid gap-4 md:grid-cols-2">

                <Card>

                    <CardHeader>

                        <CardTitle>

                            Card Title

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <p className="text-sm text-muted-foreground">

                            Card content goes here.

                        </p>

                    </CardContent>

                </Card>

            </div>

        </SectionCard>

    );

}
