import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import newer from 'gulp-newer';
import ifPlugin from 'gulp-if';

export const plugins = {
  plumber,
  browserSync,
  newer,
  if: ifPlugin,
};
