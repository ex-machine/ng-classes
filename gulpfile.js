/*eslint-env node, es6 */
'use strict';

let del = require('del');
let extend = require('extend');
let fs = require('fs')
let path = require('path');

let gulp = require('gulp');

gulp.$ = extend(require('gulp-load-plugins')(), {
	runSequence: require('run-sequence')
});


gulp.task('clean', (cb) => del(['./dist/*'], cb));


gulp.task('build', () => {
	return gulp.src(['src/ts/**/*.ts'])
	.pipe(gulp.$.typescript({
		module: 'commonjs',
		target: 'es6',
		noImplicitAny: false
	}))
	.pipe(gulp.$.debug({ title: 'build:es6' }))
	.pipe(gulp.dest('dist/es6'));
});


gulp.task('docs', function () {
  return gulp.src('dist/es6/*.js')
	.pipe(gulp.$.debug())
	.pipe(gulp.$.concat('README.md'))
	.pipe(gulp.$.debug())
	.pipe(gulp.$.jsdocToMarkdown({ template: fs.readFileSync('./docs/README.hbs', 'utf8') }))
	.on('error', function (err) {
		gulp.$.util.log('jsdoc-to-markdown:', err.message)
	})
	.pipe(gulp.$.debug())
	.pipe(gulp.dest('.'));
})


gulp.task('help', gulp.$.taskListing);

gulp.task('default', (cb) => {
	gulp.$.runSequence(
		'clean',
		'build',
		'docs',
	cb);
});
