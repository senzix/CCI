module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        parser: '@babel/eslint-parser',
    },
    plugins: ['react', 'react-hooks'],
    globals: {
        route: 'readonly',
        router: 'readonly'
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-unused-vars': ['warn', { 
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        'react-hooks/exhaustive-deps': 'warn',
        'no-undef': 'error',
        'react/no-unescaped-entities': 'off',
        'no-useless-escape': 'warn'
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
