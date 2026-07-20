import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {

    loading: boolean;

    children: React.ReactNode;

};

export function SubmitButton({

    loading,

    children,

}: Props) {

    return (

        <Button
            type="submit"
            className="w-full"
            disabled={loading}
        >

            {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {children}

        </Button>

    );

}