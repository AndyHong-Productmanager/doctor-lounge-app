import { z } from 'zod';

export const LoginResponseSchema = z.object({
  token: z.string(),
  user_email: z.string(),
  user_nicename: z.string(),
  user_display_name: z.string(),
});

export const TokenValidateSchema = z.object({
  code: z.string(),
  data: z.object({ status: z.number() }),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
