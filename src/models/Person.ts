import * as z from "zod";

export const personSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().optional(),
});
