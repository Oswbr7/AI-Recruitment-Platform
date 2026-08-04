import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";
import { SessionService } from "@/shared/services/SessionService";

import { Recommendation } from "../../models/InterviewFeedback";
import { useInterviewFeedback } from "../../hooks/useInterviewFeedback";
import { useSubmitFeedback } from "../../hooks/useSubmitFeedback";
import { FeedbackCard } from "./FeedbackCard";

interface Props {

    interviewId: string;

}

export function InterviewFeedbackSection({
    interviewId,
}: Props) {

    const [formOpen, setFormOpen] = useState(false);

    const [technicalScore, setTechnicalScore] = useState("");
    const [communicationScore, setCommunicationScore] = useState("");
    const [problemSolvingScore, setProblemSolvingScore] = useState("");
    const [cultureFitScore, setCultureFitScore] = useState("");
    const [comments, setComments] = useState("");
    const [recommendation, setRecommendation] = useState<string>("");

    const { data: feedbackList, isLoading } = useInterviewFeedback(interviewId);

    const submitFeedback = useSubmitFeedback(interviewId);

    const resetForm = () => {

        setTechnicalScore("");
        setCommunicationScore("");
        setProblemSolvingScore("");
        setCultureFitScore("");
        setComments("");
        setRecommendation("");
        setFormOpen(false);

    };

    const isValid =
        technicalScore !== "" &&
        communicationScore !== "" &&
        problemSolvingScore !== "" &&
        cultureFitScore !== "" &&
        recommendation !== "";

    const handleSubmit = () => {

        const reviewerId = SessionService.currentUserId();

        if (!isValid || !reviewerId)
            return;

        submitFeedback.mutate(
            {
                reviewerId,
                technicalScore: Number(technicalScore),
                communicationScore: Number(communicationScore),
                problemSolvingScore: Number(problemSolvingScore),
                cultureFitScore: Number(cultureFitScore),
                comments: comments || undefined,
                recommendation,
            },
            { onSuccess: resetForm }
        );

    };

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>Feedback</CardTitle>

                {!formOpen && (

                    <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
                        <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
                        Add Feedback
                    </Button>

                )}

            </CardHeader>

            <CardContent className="space-y-4">

                {formOpen && (

                    <div className="space-y-3 rounded-lg border p-4">

                        <div className="grid gap-3 sm:grid-cols-2">

                            <div className="space-y-1.5">
                                <Label>Technical (1-10)</Label>
                                <Input type="number" min={1} max={10} value={technicalScore} onChange={e => setTechnicalScore(e.target.value)} />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Communication (1-10)</Label>
                                <Input type="number" min={1} max={10} value={communicationScore} onChange={e => setCommunicationScore(e.target.value)} />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Problem Solving (1-10)</Label>
                                <Input type="number" min={1} max={10} value={problemSolvingScore} onChange={e => setProblemSolvingScore(e.target.value)} />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Culture Fit (1-10)</Label>
                                <Input type="number" min={1} max={10} value={cultureFitScore} onChange={e => setCultureFitScore(e.target.value)} />
                            </div>

                        </div>

                        <div className="space-y-1.5">

                            <Label>Recommendation</Label>

                            <Select value={recommendation} onValueChange={value => setRecommendation(value ?? "")}>

                                <SelectTrigger>
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>

                                <SelectContent>

                                    {(Object.values(Recommendation) as Recommendation[]).map(value => (
                                        <SelectItem key={value} value={value}>{value}</SelectItem>
                                    ))}

                                </SelectContent>

                            </Select>

                        </div>

                        <div className="space-y-1.5">
                            <Label>Comments</Label>
                            <Textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} />
                        </div>

                        <div className="flex justify-end gap-2">

                            <Button variant="outline" size="sm" onClick={resetForm}>
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                disabled={!isValid || submitFeedback.isPending}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>

                        </div>

                    </div>

                )}

                {isLoading ? null : !feedbackList?.length ? (

                    <EmptyState
                        title="No feedback yet"
                        description="Feedback submitted by reviewers will appear here."
                    />

                ) : (

                    <div className="space-y-3">

                        {feedbackList.map(feedback => (
                            <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}
