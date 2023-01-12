import webpHtmlNosvg from 'gulp-webp-html-nosvg';

export const html = () => app.gulp.src(app.path.src.html)
  .pipe(app.plugins.plumber({
    errorHandler(err) {
      notify.onError({
        title: 'HTML Error',
        message: 'Error: <%= error.message %>',
      })(err);
      this.emit('end');
    },
  }))
  .pipe(
    app.plugins.if(
      app.isBuild,
      webpHtmlNosvg(),
    ),
  )
  .pipe(app.gulp.dest(app.path.build.html))
  .pipe(app.plugins.browserSync.stream());
