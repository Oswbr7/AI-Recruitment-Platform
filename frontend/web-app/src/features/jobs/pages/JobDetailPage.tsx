import { useParams } from "react-router-dom";

import { JobDetailView } from "../views/JobDetailView";

export function JobDetailPage() {

    const { id } = useParams<{ id: string }>();

    if (!id)
        return null;

    return <JobDetailView id={id} />;

}
