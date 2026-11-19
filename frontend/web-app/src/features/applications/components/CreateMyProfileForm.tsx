import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { Form } from "@/components/ui/form";

import { TextField } from "@/shared/components/form/TextField";
import { SubmitButton } from "@/shared/components/form/SubmitButton";

import { useCreateMyProfile } from "@/features/candidates/hooks/useMyProfile";

const profileSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required."),

    lastName: z.string().trim().min(1, "Last name is required."),

    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    headline: z.string().trim().max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function CreateMyProfileForm() {
    const createProfile = useCreateMyProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            headline: "",
        },
    });

    function onSubmit(values: ProfileFormValues) {
        createProfile.mutate(values, {
            onSuccess: () => toast.success("Profile created! You can now apply to jobs."),
            onError: () => toast.error("Could not create your profile."),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        control={form.control}
                        name="firstName"
                        label="First name"
                        placeholder="John"
                    />

                    <TextField
                        control={form.control}
                        name="lastName"
                        label="Last name"
                        placeholder="Doe"
                    />
                </div>

                <TextField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                />

                <TextField
                    control={form.control}
                    name="headline"
                    label="Headline (optional)"
                    placeholder="Backend developer"
                />

                <SubmitButton loading={createProfile.isPending}>Create my profile</SubmitButton>
            </form>
        </Form>
    );
}
