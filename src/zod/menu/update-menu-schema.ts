import z4 from "zod/v4";

export const updateMenuSchema = z4.object({
  name: z4.string().optional(),
  reply: z4.string().optional(),
  tags: z4.array(z4.string()).optional(),
  options: z4
    .array(
      z4.object({
        id: z4.string().optional(),
        trigger: z4.number(),
        reply: z4.string(),
      })
    )
    .optional(),
});

export type UpdateMenuInput = z4.infer<typeof updateMenuSchema>;
