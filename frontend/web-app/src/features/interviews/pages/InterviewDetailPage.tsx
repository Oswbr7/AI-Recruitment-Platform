import { useParams } from "react-router-dom";

import { InterviewDetailView } from "../views/InterviewDetailView";

export function InterviewDetailPage() {

    const { id } = useParams<{ id: string }>();

    if (!id)
        return null;

    return <InterviewDetailView id={id} />;

}
