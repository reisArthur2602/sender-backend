import z4 from "zod/v4";

export const createMenuSchema = z4.object({
  name: z4
    .string("O campo 'name' é obrigatório")
    .min(2, "O campo 'name' deve ter no mínimo 2 caracteres"),
  reply: z4
    .string("O campo 'reply' é obrigatório")
    .min(2, "O campo 'reply' deve ter no mínimo 2 caracteres"),
  tags: z4.array(
    z4
      .string("O campo 'tags' é obrigatório")
      .min(2, "O campo 'tags' deve ter no mínimo 2 caracteres"),
    "O campo 'tags' é obrigatório"
  ),
  options: z4
    .array(
      z4.object({
        trigger: z4.number("O campo 'trigger' é obrigatório"),
        reply: z4
          .string("O campo 'reply' é obrigatório")
          .min(2, "O campo 'reply' deve ter no mínimo 2 caracteres"),
        label: z4
          .string("O campo 'label' é obrigatório")
          .min(2, "O campo 'label' deve ter no mínimo 2 caracteres"),
      })
    )
    .optional(),
});
export type CreateMenuInput = z4.infer<typeof createMenuSchema>;
