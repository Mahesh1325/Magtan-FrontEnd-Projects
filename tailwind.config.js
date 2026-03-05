/** @type {import('tailwindcss').Config} */
module.exports = {
    // Scan all HTML and JS files for class names
    content: [
        "./*.html",
        "./pages/**/*.html",
        "./assets/js/**/*.js",
    ],

    // Prefix all Tailwind classes with tw- to avoid conflicts with existing .btn, .card, .container etc.
    prefix: 'tw-',

    // Disable Tailwind's base/preflight reset — the project already has its own CSS reset in style.css
    corePlugins: {
        preflight: false,
    },

    theme: {
        // Match the project's own breakpoints exactly
        screens: {
            'sm': '640px',   // Mobile boundary
            'md': '768px',   // Mid-mobile
            'lg': '1024px',  // Tablet → Desktop
            'xl': '1280px',  // Desktop → Large
        },
        extend: {
            colors: {
                // Map brand colors so they can be used as tw-bg-primary etc.
                primary: '#0d9488',
                'primary-hover': '#0f766e',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            spacing: {
                'header': '80px',
            },
        },
    },

    plugins: [],
};
