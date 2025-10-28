<script lang="ts">
  
import { signInWithEmailAndPassword } from 'firebase/auth';
  import  firebaseAuth  from '../../lib/firebase.js';
  import { goto } from '$app/navigation';
  import { authUser } from '../../lib/authStore.js';

  
let success: boolean | undefined = undefined;
let email: string;
  let password: string;

  

const login = () => {
    signInWithEmailAndPassword(firebaseAuth.firebaseAuth, email, password)
      .then((userCredential) => {
        $authUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || ''
        };
      
        goto('/protected');
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
  on:submit|preventDefault={login}
>
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

  <button type="submit" class="default-action">Login</button>
  {#if !success && success !== undefined}
    <div class="p-8 text-red-500 bg-red-100">There was an error registering. Please try again.</div>
  {/if}
</form>