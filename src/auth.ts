import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./database/prisma.js";
import {
  BETTER_AUTH_GOOGLE_CLIENT_ID,
  BETTER_AUTH_GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_REDIRECT_URI,
  BETTER_AUTH_APP,
} from "./utils/constants.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: BETTER_AUTH_SECRET,

  socialProviders: {
    google: {
      clientId: BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: BETTER_AUTH_GOOGLE_CLIENT_SECRET,
      redirectURI: BETTER_AUTH_REDIRECT_URI,
    },
  },

  trustedOrigins: [BETTER_AUTH_APP],
});
