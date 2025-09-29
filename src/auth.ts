import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./database/prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET as string,

  socialProviders: {
    google: {
      display: "popup",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${
        process.env.BETTER_AUTH_URL as string
      }/api/auth/callback/google`,
    },
  },

  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user) => {
  //         await baileysServerInit(user.id);
  //       },
  //     },
  //   },
  // },

  trustedOrigins: [process.env.BETTER_AUTH_URL_FRONTEND as string],
});
