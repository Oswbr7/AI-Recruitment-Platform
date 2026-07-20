import type { User } from "./User";

export interface LoginResponse {

    accessToken: string;

    expiresAt: string;

    user: User;

}