module.exports = {
  extends: ['next', 'next/core-web-vitals', 'plugin:react/recommended'],
  rules: {
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    '@next/next/no-img-element': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': 'off',
  },
};
