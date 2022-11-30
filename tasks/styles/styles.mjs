import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import postcss from 'gulp-postcss';
import gulpif from 'gulp-if';
import replace from 'gulp-replace';
import rename from 'gulp-rename';

const {
  src,
  dest,
} = gulp;

const nodeEnv = process.env.NODE_ENV;
const browsersEnv = process.env.BROWSERSLIST_ENV;

function styles() {
  const stylesName = browsersEnv === 'modern' ? 'styles' : 'stylesLegacy';

  return src('./src/styles/index.styl')
    .pipe(gulpif(nodeEnv === 'development', sourcemaps.init()))
    .pipe(stylus())
    .pipe(postcss())
    .pipe(gulpif(nodeEnv === 'development', sourcemaps.write()))
    .pipe(replace(/@supports\s\(selector:\sfocus-visible\)/g, '@supports selector(:focus-visible)'))
    .pipe(rename(`${stylesName}.css`))
    .pipe(dest('./dist/styles'));
}

export { styles };
