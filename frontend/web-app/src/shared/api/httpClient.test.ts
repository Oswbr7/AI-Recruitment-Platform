import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

vi.mock("axios");

import { useAuthStore } from "@/features/auth/store/authStore";
import { createApiClient } from "@/shared/api/httpClient";

const mockedAxios = vi.mocked(axios, true);

type ReqHandler = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
type ResErrHandler = (error: unknown) => unknown;

let reqHandler: ReqHandler;
let resErrHandler: ResErrHandler;

function fakeConfig(): InternalAxiosRequestConfig {
    return { headers: {} } as InternalAxiosRequestConfig;
}

beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();

    // axios.create devuelve un cliente falso que solo CAPTURA los handlers
    // de los interceptores registrados, para invocarlos directamente.
    mockedAxios.create.mockReturnValue({
        interceptors: {
            request: { use: vi.fn((fn: ReqHandler) => { reqHandler = fn; }) },
            response: { use: vi.fn((_ok: unknown, err: ResErrHandler) => { resErrHandler = err; }) },
        },
    } as unknown as ReturnType<typeof axios.create>);

    createApiClient("http://test.local");
});

describe("createApiClient - request interceptor", () => {
    it("adjunta el JWT Bearer cuando hay sesion", () => {
        useAuthStore
            .getState()
            .login("token-123", { id: "1", fullName: "Ana", email: "a@b.c" });

        const config = reqHandler(fakeConfig());

        expect(config.headers.Authorization).toBe("Bearer token-123");
    });

    it("no adjunta header cuando no hay sesion", () => {
        const config = reqHandler(fakeConfig());

        expect(config.headers.Authorization).toBeUndefined();
    });
});

describe("createApiClient - response interceptor", () => {
    it("401 cierra la sesion local", async () => {
        useAuthStore
            .getState()
            .login("token-123", { id: "1", fullName: "Ana", email: "a@b.c" });

        const error = { response: { status: 401 } };

        await expect(resErrHandler(error)).rejects.toBe(error);
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("otros errores se propagan sin tocar la sesion", async () => {
        useAuthStore
            .getState()
            .login("token-123", { id: "1", fullName: "Ana", email: "a@b.c" });

        const error = { response: { status: 500 } };

        await expect(resErrHandler(error)).rejects.toBe(error);
        expect(useAuthStore.getState().accessToken).toBe("token-123");
    });
});
