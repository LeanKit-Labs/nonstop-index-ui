import gulp from "gulp";
import eslint from "gulp-eslint";
import cache from "gulp-cached";
import gulpIf from "gulp-if";

const FILES = [ "*.js", "{client,server,tasks}/**/*.{js,jsx}" ];

const isFixed = file => file.eslint != null && file.eslint.fixed;

gulp.task( "lint", () =>
	gulp.src( FILES )
		.pipe( cache( "lint" ) )
		.pipe( eslint( { fix: false } ) )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
		.pipe( gulpIf( isFixed, gulp.dest( "." ) ) )
);
