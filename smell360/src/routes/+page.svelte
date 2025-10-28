<script lang="ts">
    // This script remains clean as there is no reactive state needed for this simple page.
</script>

<svelte:head>
	<title>Home Page</title>
	<meta name="description" content="Welcome to our application" />

</svelte:head>

<div class="homepage-container">
	<div class="content-wrapper">
		
		<h1 class="main-title">
			Welcome to SMELL360
		</h1>
		
		<p class="subtitle-text">
			Please log in or register to continue.
		</p>
		
		<div class="button-container">
			
		
			<a 
				href="/login" 
				class="login-button"
			>
				Login
			</a>
			
		
			<a 
				href="/register" 
				class="register-button"
			>
				Register
			</a>
		</div>
		
	</div>
</div>

<style>
  
    .homepage-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #f3f4f6; 
        color: #111827; 
        padding: 1rem; 
        font-family: sans-serif;
    }

    .content-wrapper {
        width: 100%;
        max-width: 28rem;
        text-align: center;
    }


    .main-title {
        font-size: 2.25rem; 
        font-weight: 700; 
        margin-bottom: 1rem; 
        color: #2563eb; 
    }

   
    .subtitle-text {
        font-size: 1.125rem; 
        margin-bottom: 2rem; 
        color: #374151; 
    }

    
    .button-container {
        display: flex;
        flex-direction: column; 
        gap: 1rem; 
        justify-content: center;
    }

   
    @media (min-width: 640px) {
        .button-container {
            flex-direction: row;
        }
    }

    
    .login-button,
    .register-button {
        width: 100%; 
        padding: 0.75rem 1.5rem; 
        font-size: 1.125rem; 
        font-weight: 500; 
        border-radius: 0.5rem; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        text-align: center;
        text-decoration: none;
    
        display: block; 
    }

   
    .login-button {
        color: white;
        background-color: #2563eb; 
    }

    .login-button:hover {
        background-color: #1d4ed8;
    }

    .login-button:focus {
        outline: none;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); 
    }


    .register-button {
        color: #111827; 
        background-color: #e5e7eb;
    }

    .register-button:hover {
        background-color: #d1d5db;
    }

    .register-button:focus {
        outline: none; 
        box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.5);
    }

    
    @media (min-width: 640px) {
        .login-button,
        .register-button {
            width: auto;
        }
    }
</style>
