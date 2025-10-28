<script>
  // You can add any JavaScript logic here if needed,
  // but for simple links, we don't need any.
</script>

<svelte:head>
  <title>Home Page</title>
  <meta name="description" content="Welcome to our application" />
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
  <div class="w-full max-w-md text-center">
    
    <h1 class="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
      Welcome!
    </h1>
    
    <p class="text-lg mb-8 text-gray-700 dark:text-gray-300">
      Please log in or register to continue.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <!-- 
        We use regular <a> tags for navigation between SvelteKit routes.
        This allows the SvelteKit router to handle the navigation 
        without a full page reload.
      -->
      
      <!-- Login Button -->
      <a 
        href="/login" 
        class="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-center"
      >
        Login
      </a>
      
      <!-- Register Button -->
      <a 
        href="/register" 
        class="w-full sm:w-auto px-6 py-3 text-lg font-medium text-gray-900 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300 ease-in-out text-center dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        Register
      </a>
    </div>
    
  </div>
</div>
