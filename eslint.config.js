import reactPlugin from 'eslint-plugin-react';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

import typescriptParser from '@typescript-eslint/parser';

// Resolve __dirname equivalent in ES modules
const dirname = new URL('.', import.meta.url).pathname;

export default [
    {
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                projectService: {
                    tsconfigRootDir: dirname,
                },
            },
        },
        plugins: {
            react: reactPlugin,
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4,
                    useTabs: false,
                    singleQuote: true,
                    trailingComma: 'all',
                    semi: true,
                },
            ],
            semi: ['error', 'always'],
            'no-trailing-spaces': 'error',
            'react/no-danger': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            'max-len': ['warn', { code: 200 }],
            'max-lines-per-function': ['error', 400],
            'no-eval': 'error',
            'no-useless-escape': 'error',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    },
];
