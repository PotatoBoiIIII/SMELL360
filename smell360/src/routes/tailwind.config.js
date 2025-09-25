    const config = {
        content: [
            "./src/**/*.{html,js,svelte,ts}",
            "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
        ],
        theme: {
            extend: {},
        },
        plugins: [
            require('flowbite/plugin')
        ],
        darkMode: 'class', // Optional: for dark mode support
    };
    module.exports = config;