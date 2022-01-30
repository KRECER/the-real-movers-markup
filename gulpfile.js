const gulp = require('gulp');
const sync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');
const sortMQ = require('postcss-sort-media-queries');
const prettyhtml = require('gulp-pretty-html');
const webpackStream = require('webpack-stream');
const debug = require('gulp-debug');
const path = require('path');
const sassGlob = require('gulp-sass-glob');
const inlineSVG = require('postcss-inline-svg');
const ghpages = require('gh-pages');
const notify = require('gulp-notify');

const webpackConfig = require('./webpack.config');

// Настройки бьютификатора HTML
let prettyOption = {
  indent_size: 2,
  indent_char: ' ',
  unformatted: ['code', 'em', 'strong', 'span', 'i', 'b', 'br', 'script'],
  content_unformatted: [],
};

// Список и настройки плагинов postCSS
let postCssPlugins = [
  inlineSVG({
    paths: ['./source/'],
  }),
  autoprefixer({ grid: true }),
  sortMQ({ sort: 'desktop-first' }),
];

const reload = (done) => {
  sync.reload();
  done();
};

const clean = () => {
  return del('build');
};

const copyImages = () => {
  return gulp
    .src('source/images/*.{jpg,jpeg,png,gif,svg,webp}')
    .pipe(gulp.dest('build/images'));
};

const deploy = (cb) => {
  ghpages.publish(path.join(process.cwd(), 'build/'), cb);
};
exports.deploy = deploy;

const server = () => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
    port: 8080,
  });

  gulp.watch('source/scss/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
  gulp.watch('source/**/*.html', gulp.series(html, reload));
  gulp.watch(
    ['source/images/*.{jpg,jpeg,png,gif,svg,webp}'],
    { events: ['all'], delay: 100 },
    gulp.series(copyImages, reload),
  );
  gulp.watch(
    ['source/images/icons/*.svg'],
    { events: ['all'], delay: 100 },
    gulp.series(sprite, reload),
  );
};

const styles = () => {
  return gulp
    .src('source/scss/style.scss', { sourcemaps: true })
    .pipe(debug({ title: 'Compiles:' }))
    .pipe(sassGlob())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on(
        'error',
        notify.onError(function (error) {
          return (
            'An error occurred while compiling sass.\nLook in the console for details.\n' +
            error
          );
        }),
      ),
    )
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('build/css'))
    .pipe(
      csso({
        restructure: false,
      }),
    )
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(sync.stream());
};

const scripts = () => {
  return gulp
    .src('source/js/script.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/js'))
    .pipe(sync.stream());
};

const images = () => {
  return gulp
    .src('source/images/**/*.{jpg,png,svg}')
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo(),
      ]),
    )
    .pipe(gulp.dest('build/images'));
};
exports.images = images;

const generateToWebp = () => {
  return gulp
    .src('source/images/**/*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/images'));
};

const sprite = () => {
  return gulp
    .src('source/images/icons/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/images'));
};
exports.sprite = sprite;

const html = () => {
  return gulp
    .src('source/*.html')
    .pipe(posthtml([include({ root: 'source' })]))
    .pipe(prettyhtml(prettyOption))
    .pipe(gulp.dest('build/'))
    .pipe(sync.stream());
};

const copy = () => {
  return gulp
    .src(
      [
        'source/fonts/**/*.{woff,woff2}',
        'source/images/**',
        '!source/images/icons/**',
        '!source/images/temp/**',
        'source/*.ico',
      ],
      { base: 'source' },
    )
    .pipe(gulp.dest('build'));
};

gulp.task(
  'build',
  gulp.series(clean, copy, html, styles, scripts, sprite, generateToWebp),
);
gulp.task('default', gulp.series('build', server));
