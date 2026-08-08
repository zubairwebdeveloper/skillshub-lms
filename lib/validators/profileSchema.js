import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(280, "Bio must be under 280 characters").optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
