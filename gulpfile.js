
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

const gcmq = require('gulp-group-css-media-queries');

const smartgrid = require('smart-grid');

const babel = require('gulp-babel');



//Таск для обработки стилей
gulp.task('styles', () => {
	return gulp.src([
		'./src/libs/owlcarousel/*.css',		
		'./src/libs/magneficPopap/*.css',		
		'./src/scss/style.scss'
	])
		.pipe(sourcemaps.init())				
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(gcmq())
		.pipe(autoprefixer({
			browsers: ['> 0.1%'],
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
});


//Таск для обработки скриптов jQUery
gulp.task('scripts', () => {
	return gulp.src([
		'./src/libs/jQuery/*.js',
		'./src/libs/owlcarousel/*.js',
		'./src/libs/pageToScroll/*.js',
		'./src/libs/magneficPopap/*.js',
		'./src/libs/spincrement/*.js',
		'./src/js/scriptJquery/*.js'
	])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

//Таск для обработки скриптов кастомных
gulp.task('scriptsCustom', () => {
	return gulp.src([		
		'./src/js/script/*.js',
		'./src/js/script/script.js'
	])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('scripts.js'))
		.pipe(uglify())
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
	gulp.watch('./src/js/**/*.js', gulp.series('scripts', gulp.parallel( 'scriptsCustom') ))
	// gulp.watch('./src/js/script/*.js', gulp.series('scriptsCustom', ))
	//При изменении HTML запустить синхронизацию
	gulp.watch("./build/*.html").on('change', browserSync.reload);
});

//Таск для генерации сетки
gulp.task('grid', (done) => {
	let settings = {
		filename: "smart-grid",
		outputStyle: "scss",
		columns: 12,
		offset: "30px",
		mobileFirst: false,
		container: {
			maxWidth: "1250px",
			fields: "40px"
		},    
    	breakPoints: {
    		lg: {
				width: "1200px"
			},
			md: {
				width: "992px",
				fields: "15px"
			},
			sm: {
				width: "720px"
			},
			xs: {
				width: "576px"
			},
	        xxxs: {
	            width: "320px"
	        }
    	}
	};

	smartgrid('./src/scss', settings);
	done();
});



//Таск по умолчанию. Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'scriptsCustom','img-compress'), 'watch'));


