module.exports = {
  root: true,
  ecmaVersion: 6,
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: ['html'],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    require: true,
  },
  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production'
      ? 2
      : 0
  },
}
