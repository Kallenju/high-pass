const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const CSSvariables = require('postcss-css-variables');
const mergeRules = require('postcss-merge-rules');

let params;

const browsersEnv = process.env.BROWSERSLIST_ENV;
const nodeEnv = process.env.NODE_ENV;

if (browsersEnv === 'modern') {
  params = {
    plugins: [
      cssnano({
        plugins: [mergeRules],
      }),
      autoprefixer({ env: 'modern' }),
    ],
  };
} else if (browsersEnv === 'legacy') {
  params = {
    plugins: [
      CSSvariables({}),
      cssnano({
        plugins: [mergeRules],
      }),
      autoprefixer({ env: 'legacy' }),
    ],
  };
}

if (nodeEnv === 'production') {
  params.plugins = [...params.plugins, ...[
    cssnano({
      preset: 'default',
    }),
  ]];
}

module.exports = params;
