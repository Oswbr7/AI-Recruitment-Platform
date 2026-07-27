import { Button } from "@/components/ui/button";

interface Props {

    isSubmitting?: boolean;

    onCancel: () => void;

}

export function FormActions({

    isSubmitting,

    onCancel

}: Props) {

    return (

        <>

            <Button

                variant="outline"

                onClick={onCancel}

            >

                Cancel

            </Button>

            <Button

                type="submit"

                disabled={isSubmitting}

            >

                Save

            </Button>

        </>

    );

}