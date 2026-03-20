import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            profileImage?: string;
        } & DefaultSession["user"];
    }

    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profileImage?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            profileImage?: string;
        };
    }
}
