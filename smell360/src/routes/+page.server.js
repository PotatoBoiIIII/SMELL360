/** @satisfies {import('./$types').Actions} */
import db from '$lib/firebase.js'
import { ref, push,update } from "firebase/database";


console.log('backend running');

console.log('--- Debugging db in +page.server.js ---');

console.log('Type of db:', typeof db); // Should be 'object'

console.log('Value of db:', db); // <--- THIS IS THE KEY LOG!

console.log('--- End Debugging db ---');

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
		console.log("data retrived")
		update(ref(db.db), {

			author: "Jane",

			text: "Hello Firebase!"

		})


		return { success: true, message: data.get('email')  };
		
	}
};

