// export interface Task {
// 	name: string;
// 	period: number;
// 	personID: number;
// 	roomID: number;
// 	comment?: string;
// 	rotate?: boolean;
// }

import * as z from "zod";

export const taskSchema = z.object({
	name: z.string(),
	period: z.number(),
	personID: z.number(),
	roomID: z.number(),
	comment: z.string().optional(),
	rotate: z.boolean().optional(),
});

export type Task = z.infer<typeof taskSchema>;
