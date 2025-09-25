import { z as z4 } from "zod";

export const updateMenuSchema = z4.object({
  name: z4
    .string()
    .min(2, { message: "O campo 'name' deve ter no mínimo 2 caracteres" })
    .optional(),

  reply: z4
    .string()
    .min(2, { message: "O campo 'reply' deve ter no mínimo 2 caracteres" })
    .optional(),

  tags: z4
    .array(
      z4
        .string()
        .min(2, { message: "O campo 'tags' deve ter no mínimo 2 caracteres" })
    )
    .optional(),

  options: z4
    .array(
      z4.object({
        id: z4.string().uuid("Formato de uuid inválido").optional(),
        trigger: z4.number().optional(),
        reply: z4
          .string()
          .min(2, {
            message: "O campo 'reply' deve ter no mínimo 2 caracteres",
          })
          .optional(),
        label: z4
          .string()
          .min(2, {
            message: "O campo 'label' deve ter no mínimo 2 caracteres",
          })
          .optional(),
      })
    )
    .optional(),
});

export type UpdateMenuInput = z4.infer<typeof updateMenuSchema>;
