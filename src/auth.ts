import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./database/prisma.js";

const clientId = process.env.GOOGLE_CLIENT_ID! || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET! || "";
const secret = process.env.BETTER_AUTH_SECRET! || "";
const redirectURI = `${process.env.BETTER_AUTH_URL!}/callback/google` || "";
const app = process.env.BETTER_AUTH_URL_APP! || "";

const mode = process.env.NODE_ENV || "development";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    secret,

    socialProviders: {
        google: {
            clientId,
            clientSecret,
            redirectURI,
        },
    },

    trustedOrigins: [mode === "development" ? "http://localhost:5173" : app],
});
