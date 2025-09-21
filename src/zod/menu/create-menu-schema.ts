import z4 from "zod/v4";

export const createMenuSchema = z4.object({
  name: z4.string(),
  reply: z4.string(),
  tags: z4.array(z4.string()),
  options: z4
    .array(
      z4.object({
        trigger: z4.string(),
        reply: z4.string(),
      })
    )
    .optional(),
});
export type CreateMenuInput = z4.infer<typeof createMenuSchema>;
