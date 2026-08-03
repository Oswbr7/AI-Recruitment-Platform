import { useParams } from "react-router-dom";

import { CandidateDetailView } from "../views/CandidateDetailView";

export function CandidateDetailPage() {

    const { id } = useParams<{ id: string }>();

    if (!id)
        return null;

    return <CandidateDetailView id={id} />;

}
