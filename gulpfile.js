
const gulp = require('gulp');

const concat = require('gulp-concat');

const autoprefixer = require('gulp-autoprefixer');

const cleanCSS = require('gulp-clean-css');

const uglify = require('gulp-uglify');

const del = require('del');

const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');

const imagemin = require('gulp-imagemin');





//Таск для обработки стилей
gulp.task('styles', () => {
	return gulp.src([
		'./src/libs/**/*.scss',
		'./src/scss/style.scss'
	])
		.pipe(sourcemaps.init())				
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
});


//Таск для обработки скриптов
gulp.task('scripts', () => {
	return gulp.src([
		'./src/libs/**/*.js',
		'./src/js/**/*.js'
	])
		.pipe(concat('script.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
	return del([
		'build/css/*',
		'build/js/*',
		'build/img/*'
])
});

// Таск для сжатия изображений
gulp.task('img-compress', () => {
	return gulp.src('./src/img/**')
		.pipe(imagemin({
			progressive:true
		}))
		.pipe(gulp.dest('./build/img'))
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
	browserSync.init({
		server: {
			baseDir: "build"
		}
	});
	// Слежка за добавлением изображений
	gulp.watch('./src/img/**', gulp.series('img-compress'))
	//Следить за файлами со стилями с нужным расширением
	gulp.watch('./src/scss/**/*.scss', gulp.series('styles'))
	//Следить за JS файлами
	gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
	//При изменении HTML запустить синхронизацию
	gulp.watch("./build/*.html").on('change', browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'img-compress'), 'watch'));