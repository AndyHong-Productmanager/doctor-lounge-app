import { z } from 'zod';

/**
 * Helper for string-to-number coercion on optional fields.
 * Many IDs come as strings from the FluentCommunity API (e.g. "1", "3").
 */
const coerceOptionalNumber = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((val) => {
    if (val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

export const SpaceItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  cover_photo: z.string().nullable().optional(),
  type: z.string().optional().default('community'),
  privacy: z.string().optional().default('public'),
  status: z.string().optional().default('published'),
  members_count: z.number().optional().default(0),
  topics_count: z.number().optional().default(0),
  emoji: z.string().nullable().optional(),
  created_by: coerceOptionalNumber,
  parent_id: coerceOptionalNumber,
  serial: coerceOptionalNumber,
  settings: z.record(z.string(), z.unknown()).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
});

/**
 * Response for `/spaces` — returns user's joined spaces as a simple array.
 */
export const SpacesResponseSchema = z.object({
  spaces: z.array(SpaceItemSchema),
});

/**
 * Response for `/spaces/all-spaces` — returns paginated object.
 * { spaces: { current_page, data: [...], total, per_page, ... } }
 */
export const AllSpacesResponseSchema = z.object({
  spaces: z.object({
    data: z.array(SpaceItemSchema),
    current_page: z.number().optional(),
    total: z.number().optional(),
    per_page: z.number().optional(),
    last_page: z.number().optional(),
  }),
});

export type SpaceItem = z.infer<typeof SpaceItemSchema>;
export type SpacesResponse = z.infer<typeof SpacesResponseSchema>;
export type AllSpacesResponse = z.infer<typeof AllSpacesResponseSchema>;
