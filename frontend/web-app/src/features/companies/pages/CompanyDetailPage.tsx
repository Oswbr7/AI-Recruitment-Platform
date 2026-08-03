import { useParams } from "react-router-dom";

import { CompanyDetailView } from "../views/CompanyDetailView";

export function CompanyDetailPage() {

    const { id } = useParams<{ id: string }>();

    if (!id)
        return null;

    return <CompanyDetailView id={id} />;

}
