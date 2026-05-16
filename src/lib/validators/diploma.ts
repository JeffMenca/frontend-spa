import { z } from "zod";

export const DiplomaSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  congressId: z.string().uuid(),
  type: z.enum(["PARTICIPATION", "LEADERSHIP"]),
  activityId: z.string().uuid().nullable(),
  issuedAt: z.string(),
  congressName: z.string(),
  activityName: z.string().nullable(),
  available: z.boolean(),
});

export const DiplomaListSchema = z.object({
  items: z.array(DiplomaSchema),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type DiplomaData = z.infer<typeof DiplomaSchema>;
export type DiplomaListData = z.infer<typeof DiplomaListSchema>;
