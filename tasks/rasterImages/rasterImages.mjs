import gulp from 'gulp';
import imagemin, { mozjpeg, optipng } from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';
import through from 'through2';

const {
  src,
  dest,
} = gulp;

const imageSrcs = ['./src/images/raster/**/*.jpg', './src/images/raster/**/*.jpeg', './src/images/raster/**/*.png'];

function optimImages() {
  return src(imageSrcs)
    .pipe(imagemin([
      mozjpeg(),
      optipng(),
    ], {
      silent: false,
    }))
    .pipe(dest('./dist/images/raster'));
}

function convertImagesToWebp() {
  function webp(options = {}) {
    const instance = imageminWebp(options);

    return through.obj((file, _encoding, callback) => {
      instance(file.contents)
        .then((result) => {
          const outputFile = file;
          outputFile.contents = result;
          outputFile.extname = '.webp';
          callback(null, outputFile);
        });
    });
  }

  return src(imageSrcs)
    .pipe(webp())
    .pipe(dest('./dist/images/raster'));
}

export { optimImages, convertImagesToWebp };
