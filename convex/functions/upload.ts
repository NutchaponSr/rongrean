import { authMutation } from "../lib/crpc";

export const generateUploadUrl = authMutation
  .mutation(async ({ ctx }) => {
    return await ctx.storage.generateUploadUrl();
  })