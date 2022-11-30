let browsers = 'modern';

if (process.env.BROWSERSLIST_ENV === 'legacy') {
  browsers = 'legacy';
}

const params = {
  presets: [
    [
      '@babel/preset-env',
      {
        browserslistEnv: browsers,
        useBuiltIns: 'usage',
        corejs: { version: '3.24', proposals: true },
      },
    ],
  ],

  overrides: [{
    exclude: browsers === 'modern'
      ? [
        /node_modules/,
        /\bcore-js\b/,
        /\bwebpack\/buildin\b/,
      ] : [
        /\bcore-js\b/,
        /\bwebpack\/buildin\b/,
      ],
  }],

  ignore: ['./scripts/forLegacyBrowsers.js'],
};

module.exports = params;
