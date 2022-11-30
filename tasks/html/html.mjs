import gulp from 'gulp';
import htmlMin from 'gulp-htmlmin';
import gulpif from 'gulp-if';

const {
  src,
  dest,
} = gulp;

const nodeEnv = process.env.NODE_ENV;

function html() {
  return src('./src/*.html')
    .pipe(gulpif(nodeEnv === 'production', htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('./dist'));
}

export { html };
