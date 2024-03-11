/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
    theme: {
        extend: {},
    },
    plugins: [
        require('flowbite/plugin'),
        function ({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-thin': { scrollbarWidth: 'thin', scrollbarColor: 'rgb(31 29 29) white' },
                '.scrollbar-webkit': {
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: 'white' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgb(31 41 55)',
                        borderRadius: '20px',
                        border: '1px solid white',
                    },
                },
            };
            addUtilities(newUtilities, ['responsive', 'hover']);
        },
    ],
};
