export function splitKeyValues(obj: any): { keys: string; values: string } {
	let keys = Object.keys(obj).join('", "');
	keys = `"${keys}"`;

	let valuesArr = Object.values(obj);
	valuesArr.forEach((value: any, index, arr) => {
		if (typeof value == "string") arr[index] = `'${value}'`;
	});

	return { keys: keys, values: valuesArr.join(", ") };
}

export function equalKeyValues(obj: any) {}
