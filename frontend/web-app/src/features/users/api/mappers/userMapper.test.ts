import { describe, it, expect } from "vitest";

import { toUserListItem } from "./userMapper";
import type { UserResponseDto } from "../dto/UserResponseDto";

describe("toUserListItem", () => {
    it("compone fullName desde firstName + lastName", () => {
        const dto: UserResponseDto = {
            id: "u-1",
            firstName: "Ana",
            lastName: "García",
            email: "ana@example.com",
            role: "Admin",
        };

        const user = toUserListItem(dto);

        expect(user.id).toBe("u-1");
        expect(user.fullName).toBe("Ana García");
        expect(user.email).toBe("ana@example.com");
        expect(user.role).toBe("Admin");
    });

    it("trim limpia espacios sobrantes en fullName", () => {
        const user = toUserListItem({
            id: "u-2",
            firstName: "Ana",
            lastName: "",
            email: "ana@example.com",
            role: "Candidate",
        });

        expect(user.fullName).toBe("Ana");
    });
});
