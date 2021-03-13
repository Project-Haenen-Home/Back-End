import * as z from "zod";

export const taskSchema = z.object({
	name: z.string(),
	period: z.number(),
	personID: z.number(),
	roomID: z.number(),
	comment: z.string().optional(),
	rotate: z.boolean().optional(),
});
