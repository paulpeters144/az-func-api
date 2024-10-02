module.exports = {
   env: {
      node: true,
      es2021: true,
   },
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended', // Add this line
   ],
   overrides: [
      {
         env: {
            node: true,
         },
         files: ['.eslintrc.{js,cjs}'],
         parserOptions: {
            sourceType: 'script',
         },
      },
   ],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
   },
   plugins: ['@typescript-eslint', 'prettier'], // Add 'prettier' here
   rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': [
         'error',
         {
            'ts-ignore': 'allow-with-description',
         },
      ],
      'no-restricted-syntax': [
         'warn',
         {
            selector: 'ClassDeclaration',
            message:
               'Classes are not allowed. Use function-based components or other constructs instead.',
         },
      ],
      'prettier/prettier': 'error', // Ensure Prettier errors are reported
   },
};
