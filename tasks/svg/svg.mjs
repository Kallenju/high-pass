import gulp from 'gulp';
import sprite from 'gulp-svg-sprite';

const {
  src,
  dest,
} = gulp;

function svg() {
  return src('./src/images/vector/**/*.svg')
    .pipe(sprite({
      mode: {
        symbol: {
          dest: './sprite',
          sprite: '',
        },
      },
    }))
    .pipe(dest('./dist/images/'));
}

export { svg };
