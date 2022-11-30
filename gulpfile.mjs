/* eslint-disable import/extensions */
import gulp from 'gulp';
import { deleteAsync as del } from 'del';
import browserSyncToCreate from 'browser-sync';
import { html as htmlTask } from './tasks/html/html.mjs';
import { optimImages, convertImagesToWebp } from './tasks/rasterImages/rasterImages.mjs';
import { scripts as scriptsTask } from './tasks/scripts/scripts.mjs';
import { styles as stylesTask } from './tasks/styles/styles.mjs';
import { svg as svgTask } from './tasks/svg/svg.mjs';
import { justCopy as justCopyTask } from './tasks/justCopy/justCopy.mjs';

const {
  series,
  parallel,
  watch,
} = gulp;

const browserSync = browserSyncToCreate.create();

const distBase = './dist';
const srcBase = './src';
const htmlPathPart = '';
const rasterImagesPathPart = '/images/raster';
const scriptsPathPart = '/scripts';
const stylesPathPart = '/styles';
const svgPathPart = '/images/vector';
const resourcesPathPart = ['/fonts', '/styles', '/images/raster', '/scripts/npmScripts'];
const htmlPatternPart = '/*.html';
const rasterImagesPatternPart = [['/**/*.jpg', '/**/*.jpeg', '/**/*.png']];
const scriptsPatternPart = '/**/*.js';
const stylesPatternPart = '/**/*.styl';
const svgPatternPart = '/**/*.svg';
const resourcesPatternPart = [['/**/*'], ['/**/*.css'], ['/**/*.svg'], ['/*.js']];

function createPattern(pathPart, base, patternPart = null) {
  let pathArr = [base + pathPart];

  if (Array.isArray(pathPart)) {
    pathArr = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of pathPart) {
      const pathItem = base + item;

      pathArr.push(pathItem);
    }
  }

  if (!patternPart) {
    return pathArr;
  }

  const pattern = [];

  let patternPartArr = patternPart;

  if (!Array.isArray(patternPart)) {
    patternPartArr = [patternPart];
  }

  for (
    let pathArrIndex = 0,
      pathArrIndexLength = pathArr.length;
    pathArrIndex < pathArrIndexLength;
    ++pathArrIndex
  ) {
    const patternPartItem = patternPartArr[pathArrIndex];

    if (Array.isArray(patternPartItem)) {
      // eslint-disable-next-line no-restricted-syntax
      for (
        const item of patternPartItem
      ) {
        const patternItem = pathArr[pathArrIndex] + item;

        pattern.push(patternItem);
      }
    } else {
      const patternItem = pathArr[pathArrIndex] + patternPartItem;

      pattern.push(patternItem);
    }
  }

  return pattern;
}

function clean(path = './dist') {
  return () => del(path);
}

function html() {
  return htmlTask()
    .pipe(browserSync.stream());
}

function optimImagesTask() {
  return optimImages()
    .pipe(browserSync.stream());
}

function convertImagesToWebpTask() {
  return convertImagesToWebp()
    .pipe(browserSync.stream());
}

function scripts() {
  return scriptsTask()
    .pipe(browserSync.stream());
}

function styles() {
  return stylesTask()
    .pipe(browserSync.stream());
}

function svg() {
  return svgTask()
    .pipe(browserSync.stream());
}

function justCopy() {
  return justCopyTask()
    .pipe(browserSync.stream());
}

function runServer() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

function stopServer(done) {
  if (browserSync.active) {
    browserSync.exit();
  }
  done();
}

const htmlSeries = series(
  stopServer,
  clean(createPattern(htmlPathPart, distBase, htmlPatternPart)),
  html,
  runServer,
);

const rasterImagesSeries = series(
  stopServer,
  clean(createPattern(rasterImagesPathPart, distBase)),
  series(optimImagesTask, convertImagesToWebpTask),
  runServer,
);

const scriptsSeries = series(
  stopServer,
  clean(createPattern(scriptsPathPart, distBase)),
  scripts,
  runServer,
);

const stylesSeries = series(
  stopServer,
  clean(createPattern(stylesPathPart, distBase)),
  styles,
  runServer,
);

const svgSeries = series(
  stopServer,
  clean(createPattern(svgPathPart, distBase)),
  svg,
  runServer,
);

const justCopySeries = series(
  stopServer,
  clean(createPattern(resourcesPathPart, distBase)),
  justCopy,
  runServer,
);

const legacy = parallel(
  scripts,
  styles,
);

watch(createPattern(htmlPathPart, srcBase, htmlPatternPart), html);
watch(createPattern(rasterImagesPathPart, srcBase, rasterImagesPatternPart), series(
  optimImagesTask,
  convertImagesToWebpTask,
));
watch(createPattern(scriptsPathPart, srcBase, scriptsPatternPart), scripts);
watch(createPattern(stylesPathPart, srcBase, stylesPatternPart), styles);
watch(createPattern(svgPathPart, srcBase, svgPatternPart), svg);
watch(createPattern(resourcesPathPart, srcBase, resourcesPatternPart), justCopy);

export {
  htmlSeries,
  rasterImagesSeries,
  scriptsSeries,
  stylesSeries,
  svgSeries,
  justCopySeries,
  legacy,
};

export default series(
  clean(),
  parallel(
    html,
    series(
      optimImagesTask,
      convertImagesToWebpTask,
    ),
    scripts,
    styles,
    svg,
    justCopy,
  ),
  runServer,
);
