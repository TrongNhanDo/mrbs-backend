module.exports = {
   env: {
      browser: true,
      commonjs: true,
      es2021: true,
      node: true,
   },
   extends: 'eslint:recommended',
   overrides: [],
   parserOptions: {
      ecmaVersion: 'latest',
   },
   rules: {
      'no-unused-vars': [
         'warn',
         { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],
      'no-useless-catch': ['off'],
   },
};
