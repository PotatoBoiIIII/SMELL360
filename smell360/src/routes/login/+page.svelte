<script lang="ts">
  
import { getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
  import  firebaseAuth  from '../../lib/firebase.js';
  import { goto } from '$app/navigation';
  import { authUser } from '../../lib/authStore.js';
  

  
let success: boolean | undefined = undefined;
let email: string;
  let password: string;

  const auth = getAuth();

const login = () => {
   
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return signInWithEmailAndPassword(firebaseAuth.firebaseAuth, email, password)
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
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    
  };
</script>

<div class="login-container-wrapper">
    <form
        class="login-form"
        on:submit|preventDefault={login}
    >
        <input
            type="email"
            placeholder="Email"
            class="input-field"
            required
            bind:value={email}
        />
        <input
            type="password"
            placeholder="Password"
            class="input-field"
            required
            bind:value={password}
        />

        <button type="submit" class="default-action login-button">Login</button>
        
        {#if !success && success !== undefined}
            <div class="error-message">
                There was an error logging in. Please check your credentials and try again.
            </div>
        {/if}
    </form>
</div>

<style>
    /* Wrapper for centering the form */
    .login-container-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f3f4f6; /* bg-gray-100 */
    }

    /* Form Styles (Equivalent to: flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12) */
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* gap-4 */
        padding: 2rem; /* p-8 */
        margin-top: 1rem; /* space-y-4 is handled by gap/margin-top */
        background-color: white; /* bg-white */
        border-radius: 0.5rem; /* rounded-lg */
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* light shadow */
        width: 100%; /* w-full */
        max-width: 400px; /* Max width for large screens */
    }

    /* Tablet/Desktop Width adjustment (Equivalent to: sm:w-10/12) */
    @media (min-width: 640px) {
        .login-form {
            width: 83.333333%; /* 10/12 of the max-width container */
        }
    }

    /* Input Fields (Equivalent to: px-4 py-2 border border-gray-300 rounded-md) */
    .input-field {
        padding: 0.5rem 1rem; /* px-4 py-2 */
        border: 1px solid #d1d5db; /* border border-gray-300 */
        border-radius: 0.375rem; /* rounded-md */
        transition: border-color 0.2s;
    }

    .input-field:focus {
        outline: none;
        border-color: #3b82f6; /* Focus ring color */
        box-shadow: 0 0 0 1px #3b82f6;
    }
    
    /* Login Button (Using a simple primary style for 'default-action') */
    .login-button {
        background-color: #2563eb; /* bg-blue-600 */
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        border: none;
    }

    .login-button:hover {
        background-color: #1d4ed8; /* hover:bg-blue-700 */
    }

    /* Error Message (Equivalent to: p-8 text-red-500 bg-red-100) */
    .error-message {
        padding: 2rem; /* p-8 */
        color: #ef4444; /* text-red-500 */
        background-color: #fee2e2; /* bg-red-100 */
        border-radius: 0.375rem;
        text-align: center;
        font-weight: 500;
    }
</style>