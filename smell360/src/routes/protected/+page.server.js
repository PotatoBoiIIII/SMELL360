/** @satisfies {import('../$types.js').Actions} */
import db from '$lib/firebase.js'
import { ref, push,update, remove,serverTimestamp } from "firebase/database";



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
		console.log(typeof data.get("markerId"))
		const id = data.get('markerId')?.toString()
		
		const description = data.get("Description")?.toString()
		const username  = data.get("username")?.toString()
		console.log("id:"+id)
		
		update(ref(db.db,'markers/'+id), {

			author: username,
			description: description,
			timestamp: serverTimestamp()

		})
		

		return { success: true  };
		
	}
};

