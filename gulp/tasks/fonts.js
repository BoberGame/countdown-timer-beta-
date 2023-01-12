import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTft = () => app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
  .pipe(app.plugins.plumber({
    errorHandler(err) {
      notify.onError({
        title: 'Fonts Error',
        message: 'Error: <%= error.message %>',
      })(err);
      this.emit('end');
    },
  }))
  .pipe(fonter({
    formats: ['ttf'],
  }))
  .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));

export const ttfToWoff = () => app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
  .pipe(app.plugins.plumber())
  .pipe(fonter({
    formats: ['woff'],
  }))
  .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
  .pipe(ttf2woff2())
  .pipe(app.gulp.dest(`${app.path.build.fonts}`));

export const fontsStyle = () => {
  const fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          const fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            const splitStr = fontFileName.split('-');
            const fontName = splitStr[0] ? splitStr[0] : fontFileName;
            let fontWeight = splitStr[1] ? splitStr[1] : fontFileName;
            const lowFontWeight = fontWeight.toLowerCase();
            if (lowFontWeight === 'thin') fontWeight = 100;
            else if (lowFontWeight === 'extralight') fontWeight = 200;
            else if (lowFontWeight === 'light') fontWeight = 300;
            else if (lowFontWeight === 'medium') fontWeight = 500;
            else if (lowFontWeight === 'semibold') fontWeight = 600;
            else if (lowFontWeight === 'bold') fontWeight = 700;
            else if (lowFontWeight === 'extrabold') fontWeight = 800;
            else if (lowFontWeight === 'heavy') fontWeight = 800;
            else if (lowFontWeight === 'black') fontWeight = 900;
            else fontWeight = 400;
            fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
            newFileOnly = fontFileName;
          }
        }
      } else console.log('Файл scss/fonts.scss уже существует.');
    }
  });
  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() {}
};
