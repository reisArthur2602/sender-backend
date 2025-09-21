import z4 from "zod/v4";

export const deleteMenuSchema = z4.object({
  menuId: z4.string(),
});

export type DeleteMenuInput = z4.infer<typeof deleteMenuSchema>;
