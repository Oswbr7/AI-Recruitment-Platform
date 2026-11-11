import { describe, it, expect } from "vitest";

import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
    it("list deriva de all e incluye los filtros", () => {
        const filters = { status: "Open", page: 1 };

        expect(queryKeys.jobs.list(filters)).toEqual(["jobs", "list", filters]);
        expect(queryKeys.candidates.list()).toEqual(["candidates", "list", undefined]);
    });

    it("detail deriva de all por dominio", () => {
        expect(queryKeys.jobs.detail("42")).toEqual(["jobs", "detail", "42"]);
        expect(queryKeys.interviews.detail("7")).toEqual(["interviews", "detail", "7"]);
    });

    it("los sub-recursos derivan de detail (invalidacion en cascada)", () => {
        // notes depende del detail del candidato: invalidar el detail
        // invalida tambien sus notas (TanStack Query por prefijo).
        expect(queryKeys.candidates.notes("9")).toEqual(["candidates", "detail", "9", "notes"]);
        expect(queryKeys.companies.contacts("3")).toEqual(["companies", "detail", "3", "contacts"]);
        expect(queryKeys.interviews.feedback("5")).toEqual(["interviews", "detail", "5", "feedback"]);
    });

    it("users tiene su propio dominio para invalidar la lista de admin", () => {
        expect(queryKeys.users.all).toEqual(["users"]);
    });
});
