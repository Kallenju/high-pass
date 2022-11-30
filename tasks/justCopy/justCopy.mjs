import gulp from 'gulp';

const {
  src,
  dest,
} = gulp;

const resources = ['./src/fonts/**/*', './src/styles/**/*.css', './src/images/raster/**/*.svg', './src/scripts/npmScripts/*.js'];

function justCopy() {
  return src(resources, {
    base: './src',
  })
    .pipe(dest('./dist'));
}

export { justCopy };
