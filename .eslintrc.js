module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  overrides: [],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      // your babel options
      presets: ['@babel/preset-env', '@babel/preset-react'],
      parserOpts: {
        plugins: ['jsx', 'ts', 'js']
      }
    }
  },
  rules: {
    'no-unused-vars': 'error',
    'no-useless-catch': 'off',
    'no-console': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
