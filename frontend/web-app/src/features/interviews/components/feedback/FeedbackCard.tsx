import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/shared/StatusBadge";

import { Recommendation, type InterviewFeedback } from "../../models/InterviewFeedback";

const variantByRecommendation: Record<InterviewFeedback["recommendation"], "success" | "warning" | "info" | "danger"> = {
    [Recommendation.StrongHire]: "success",
    [Recommendation.Hire]: "success",
    [Recommendation.Neutral]: "info",
    [Recommendation.NoHire]: "danger",
    [Recommendation.StrongNoHire]: "danger",
};

interface Props {

    feedback: InterviewFeedback;

}

export function FeedbackCard({
    feedback,
}: Props) {

    return (

        <Card size="sm">

            <CardContent className="space-y-2">

                <div className="flex items-center justify-between">

                    <div className="flex gap-4 text-sm">

                        <span>Technical: <strong>{feedback.technicalScore}</strong></span>
                        <span>Communication: <strong>{feedback.communicationScore}</strong></span>
                        <span>Problem Solving: <strong>{feedback.problemSolvingScore}</strong></span>
                        <span>Culture Fit: <strong>{feedback.cultureFitScore}</strong></span>

                    </div>

                    <StatusBadge variant={variantByRecommendation[feedback.recommendation]}>
                        {feedback.recommendation}
                    </StatusBadge>

                </div>

                {feedback.comments && (
                    <p className="text-sm text-muted-foreground">{feedback.comments}</p>
                )}

                <p className="text-xs text-muted-foreground">
                    {feedback.createdAt.toLocaleString()}
                </p>

            </CardContent>

        </Card>

    );

}
