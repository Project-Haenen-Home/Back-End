import * as z from "zod";

export const querySchema = z.object({
	limit: z.bigint().optional(),
	roomID: z.bigint().optional(),
});

export function remapQuery(obj: any): Object {
	for (const key in obj) {
		let val: any = Number(obj[key]);
		if (!Number.isNaN(val)) {
			if (val == Math.floor(val)) val = BigInt(val);
		}

		obj[key] = val;
	}

	return obj;
}
