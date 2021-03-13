import * as z from "zod";

export const roomSchema = z.object({
	name: z.string(),
});
