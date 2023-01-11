/*eslint-env node*/

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'unused-imports'],
    root: true,
    settings: {
        'import/resolver': {
            typescript: true,
            node: true
        }
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/order': [
            1,
            {
                'newlines-between': 'always',
                groups: [
                    ['external', 'builtin'],
                    ['internal', 'sibling', 'parent', 'index']
                ],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ],
        'object-curly-spacing': ['error', 'always'],
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_'
            }
        ]
    }
};
