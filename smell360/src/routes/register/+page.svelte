
<script lang="ts">
import { goto } from '$app/navigation';
  import { getDatabase, ref, child, push, update, set,query,get,onValue, remove } from "firebase/database";  
  import db from '$lib/firebase.js'
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import  firebaseAuth  from '../../lib/firebase.js';

  let email: string;
  let password: string;
  let username: string;

  let success: boolean | undefined = undefined;
  
  const register = () => {
    createUserWithEmailAndPassword(firebaseAuth.firebaseAuth, email, password)
      .then((userCredential) => {
        const userRef = ref(db.db, 'users/'+userCredential.user.uid);
      set(userRef, {
          username: {username}
      });
       
        goto('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        success = false;
      });
  };
</script>

<form
  class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
  on:submit|preventDefault={register}
>

<input
    type="username"
    placeholder="Username"
    class="px-4 py-2 border border-gray-300 rounded-md"
    required
    bind:value={username}
  />
  <input
    type="email"
    placeholder="Email"
    class="px-4 py-2 border border-gray-300 rounded-md"
    required
    bind:value={email}
  />
  <input
    type="password"
    placeholder="Password"
    class="px-4 py-2 border border-gray-300 rounded-md"
    required
    bind:value={password}
  />

  <button type="submit" class="default-action">Register</button>
  {#if !success && success !== undefined}
    <div class="p-8 text-red-500 bg-red-100">There was an error registering. Please try again.</div>
  {/if}
</form>