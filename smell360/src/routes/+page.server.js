/** @satisfies {import('./$types').Actions} */
export const actions = {
	// default: async (event) => {
	// 	// some code
	// 	return { success: true };
	// },
	login: async (event) => {
		// some code
		return { success: true };
	},
	register: async ({request}) => {
		// some code
		const data = await request.formData();
		return { success: true, message: data.get('email') };
	}
};

