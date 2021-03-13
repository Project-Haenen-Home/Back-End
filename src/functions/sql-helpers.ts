export function splitKeyValues(obj: any): { keys: string; values: string } {
	let keys = Object.keys(obj).join('", "');
	keys = `"${keys}"`;

	let valuesArr = Object.values(obj);
	valuesArr.forEach((value: any, index, arr) => {
		if (typeof value == "string") arr[index] = `'${value}'`;
	});

	return { keys: keys, values: valuesArr.join(", ") };
}

export function equalKeyValues(obj: any): string {
	let output: string[] = [];

	for (const key in obj) {
		let value = obj[key];
		if (typeof value == "string") value = `'${value}'`;
		output.push(`"${key}" = ${value}`);
	}

	return output.join(", ");
}
