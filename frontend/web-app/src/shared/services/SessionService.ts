import type { User } from "@/features/auth/types";
import { useAuthStore } from "@/features/auth/store/authStore";

export class SessionService {

    static login(
        token: string,
        user: User
    ) {

        useAuthStore
            .getState()
            .login(token, user);

    }

    static logout() {

        useAuthStore
            .getState()
            .logout();

    }

    static token() {

        return useAuthStore
            .getState()
            .accessToken;

    }

    static currentUser() {

        return useAuthStore
            .getState()
            .user;

    }

}

// import { useAuthStore } from "@/features/auth/store/authStore";

// export class SessionService {

//     static login(
//         token:string,
//         user:any
//     ){

//         useAuthStore
//             .getState()
//             .login(token,user);

//     }

//     static logout(){

//         useAuthStore
//             .getState()
//             .logout();

//     }

// }