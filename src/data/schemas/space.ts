import { z } from 'zod';

export const SpaceItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  cover_photo: z.string().nullable().optional(),
  members_count: z.number().optional().default(0),
  type: z.string().optional().default('open'),
});

export const SpacesResponseSchema = z.object({
  spaces: z.array(SpaceItemSchema),
});

export type SpaceItem = z.infer<typeof SpaceItemSchema>;
