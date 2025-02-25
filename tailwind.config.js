import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Tahoma', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#fff9e6',
                    100: '#ffedb3',
                    200: '#ffe180',
                    300: '#ffd54d',
                    400: '#ffc91a',
                    500: '#e6b300',  // Main yellow
                    600: '#b38900',
                    700: '#806200',
                    800: '#4d3b00',
                    900: '#1a1400',
                },
                secondary: {
                    50: '#ffe6e6',
                    100: '#ffb3b3',
                    200: '#ff8080',
                    300: '#ff4d4d',
                    400: '#ff1a1a',
                    500: '#e60000',  // Main red
                    600: '#b30000',
                    700: '#800000',
                    800: '#4d0000',
                    900: '#1a0000',
                }
            }
        },
    },

    plugins: [forms],
};
