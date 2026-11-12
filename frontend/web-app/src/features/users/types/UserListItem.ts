export const ROLE_VALUES = ["Candidate", "Recruiter", "Admin"] as const;

export type RoleValue = (typeof ROLE_VALUES)[number];

export interface UserListItem {
    id: string;

    fullName: string;

    email: string;

    role: string;
}
