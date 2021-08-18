module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 11,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    sourceType: 'module'
  },
  extends: ['prettier', 'plugin:prettier/recommended', 'plugin:vue/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'vue/attribute-hyphenation': 'off',
    'dot-notation': 'off',
    'handle-callback-err': 'off',
    'vue/no-v-html': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 100
      }
    ]
  }
}
