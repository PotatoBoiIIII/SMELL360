<script lang="ts">
    import  firebaseAuth  from '../lib/firebase.js'; // 1. Import the auth service
    import { authUser } from '../lib/authStore.js'; // 2. Import your Svelte store
    import { onAuthStateChanged } from 'firebase/auth';

    // NEW: State to track if Firebase has finished checking for a persisted session
    let isAuthReady = false;

    // 3. Set up the listener. This code now runs on EVERY page load.
    onAuthStateChanged(firebaseAuth.firebaseAuth, (user) => {
        if (user) {
            // User is signed in (or was persisted from a previous session)
            authUser.set({
                uid: user.uid,
                email: user.email || ''
            });
        } else {
            // User is signed out
            authUser.set(null);
        }
        
        // CRUCIAL: Set this to true *after* Firebase finishes its check, 
        // regardless of the result.
        isAuthReady = true;
    });
</script>

<!-- 
    The #if block here acts as the new client-side guard. 
    It prevents any page content (the <slot />) from rendering until 
    the Firebase auth status is definitively known.
-->
{#if isAuthReady}
    <slot />
{:else}
    <!-- Optional Loading State -->
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <p class="text-xl font-medium text-gray-700">Loading user session...</p>
    </div>
{/if}
