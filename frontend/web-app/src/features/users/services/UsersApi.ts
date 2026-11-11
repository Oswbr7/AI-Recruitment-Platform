import { api } from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/types";

import type { UserResponseDto } from "../api/dto/UserResponseDto";
import { toUserListItem } from "../api/mappers/userMapper";
import type { UserListItem } from "../types/UserListItem";

export const usersApi = {

    // GET /api/users — lista todos los usuarios (cualquier usuario autenticado;
    // el cambio de rol, en cambio, exige Admin en el backend).
    async getAll(): Promise<UserListItem[]> {

        const response =
            await api.get<ApiResponse<UserResponseDto[]>>(
                "/users"
            );

        return response.data.data.map(toUserListItem);

    },

    // PATCH /api/users/{id}/role — Admin-only (RequireRole del backend).
    async changeRole(
        id: string,
        role: string
    ): Promise<void> {

        await api.patch(
            `/users/${id}/role`,
            { role }
        );

    },

};
