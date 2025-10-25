/** @satisfies {import('./$types').Actions} */
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
		const first = data.get('firstName')?.toString()
		const last = data.get('lastName')?.toString()
		const title = data.get("Title")?.toString()
		const description = data.get("Description")?.toString()
		const author = first+" "+last
		console.log("id:"+id)
		
		update(ref(db.db,'markers/'+id), {

			author: author,
			title: title,
			description: description,
			timestamp: serverTimestamp()

		})
		

		return { success: true, message: data.get('email')  };
		
	}
};

