
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

<div class="register-container-wrapper">
    <!-- Form adapted from your login styles -->
    <form
        class="register-form"
        on:submit|preventDefault={register}
    >
        <h2 class="form-title">Create Account</h2>
        
        <input
            type="text"
            placeholder="Username"
            class="input-field"
            required
            bind:value={username}
        />
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

        <button type="submit" class="register-button">Register</button>
        
        {#if !success && success !== undefined}
            <div class="error-message">
                There was an error registering. Please try again.
            </div>
        {/if}
        
        <a href="/login" class="login-link">Already have an account? Login here.</a>
    </form>
</div>

<style>
    /* * NOTE: These styles are identical to the login component to ensure consistency 
     * but are renamed with a .register- prefix where needed.
     */
    
    /* Wrapper for centering the form */
    .register-container-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f3f4f6; /* bg-gray-100 */
    }

    /* Title */
    .form-title {
        font-size: 1.5rem; /* large text */
        font-weight: 700; /* bold */
        color: #1f2937; /* gray-800 */
        margin-bottom: 1.5rem;
        text-align: center;
    }

    /* Form Styles */
    .register-form {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* gap-4 */
        padding: 2rem; /* p-8 */
        background-color: white; /* bg-white */
        border-radius: 0.5rem; /* rounded-lg */
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* light shadow */
        width: 100%; /* w-full */
        max-width: 400px; /* Max width for large screens */
    }

    /* Tablet/Desktop Width adjustment */
    @media (min-width: 640px) {
        .register-form {
            width: 83.333333%; /* Approximately 10/12 of the max-width container */
        }
    }

    /* Input Fields */
    .input-field {
        padding: 0.5rem 1rem; /* px-4 py-2 */
        border: 1px solid #d1d5db; /* border border-gray-300 */
        border-radius: 0.375rem; /* rounded-md */
        transition: border-color 0.2s;
        font-size: 1rem;
    }

    .input-field:focus {
        outline: none;
        border-color: #3b82f6; /* Focus ring color */
        box-shadow: 0 0 0 1px #3b82f6;
    }
    
    /* Register Button (Primary style) */
    .register-button {
        background-color: #10b981; /* A nice green color for registration */
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        border: none;
        font-size: 1rem;
    }

    .register-button:hover {
        background-color: #059669; /* Darker green on hover */
    }

    /* Error Message */
    .error-message {
        padding: 2rem; /* p-8 */
        color: #ef4444; /* text-red-500 */
        background-color: #fee2e2; /* bg-red-100 */
        border-radius: 0.375rem;
        text-align: center;
        font-weight: 500;
    }

    /* Link to Login */
    .login-link {
        color: #2563eb;
        text-align: center;
        text-decoration: none;
        font-size: 0.9rem;
    }
    .login-link:hover {
        text-decoration: underline;
    }
</style>