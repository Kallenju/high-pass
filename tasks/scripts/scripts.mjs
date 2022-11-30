import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import log from 'gulplog';
import gulpif from 'gulp-if';
import rename from 'gulp-rename';

const {
  src,
  dest,
} = gulp;

const nodeEnv = process.env.NODE_ENV;
const browsersEnv = process.env.BROWSERSLIST_ENV;

function scripts() {
  const mainName = browsersEnv === 'modern' ? 'main' : 'mainLegacy';

  if (browsersEnv === 'modern') {
    return src(['./src/scripts/**/*.js', '!./src/scripts/npmScripts/*.js'])
      .pipe(gulpif(nodeEnv === 'production', uglify()))
      .pipe(rename((path) => {
        if (path.dirname === '.') {
          // eslint-disable-next-line no-param-reassign
          path.basename = `${mainName}`;
        }
      }))
      .pipe(dest('./dist/scripts/'));
  }

  return browserify({
    entries: './src/scripts/index.js',
    debug: false,
  })
    .transform('babelify')
    .bundle()
    .pipe(source(`${mainName}.js`))
    .pipe(buffer())
    .pipe(gulpif(nodeEnv === 'development', sourcemaps.init()))
    .pipe(gulpif(nodeEnv === 'production', uglify()))
    .on('error', log.error)
    .pipe(gulpif(nodeEnv === 'development', sourcemaps.write()))
    .pipe(dest('./dist/scripts/'));
}

export { scripts };
