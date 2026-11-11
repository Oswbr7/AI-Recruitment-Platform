import type { UserResponseDto } from "../dto/UserResponseDto";
import type { UserListItem } from "../../types/UserListItem";

export function toUserListItem(dto: UserResponseDto): UserListItem {
    return {
        id: dto.id,
        fullName: `${dto.firstName} ${dto.lastName}`.trim(),
        email: dto.email,
        role: dto.role,
    };
}
