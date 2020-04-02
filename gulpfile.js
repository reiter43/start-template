
const gulp = require('gulp');

const del = require('del');
const rename = require("gulp-rename");

const browserSync = require('browser-sync').create();

const fileinclude = require('gulp-file-include');

const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const smartgrid = require('smart-grid');

const webpackStr = require("webpack-stream");
const webpack = require('webpack');

const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require("imagemin-webp");
const cache = require('gulp-cache');
const imageResize = require('gulp-image-resize');

const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const svgSprite = require("gulp-svg-sprite");



let varDel = [
	'build/css/*',
	'build/js/*',
	'build/*.html',
];

let settings = {
	filename: "smart-grid",
	outputStyle: "scss",
	columns: 12,
	offset: "30px",
	mobileFirst: false,
	container: {
		maxWidth: "1920px",
		fields: "181px"
	},
	breakPoints: {
		lllg: {
			width: "1700px",
			fields: "100px"
		},
		llg: {
			width: "1450px",
			fields: "50px"
		},
		lg: {
			width: "1200px",
			fields: "50px"
		},
		md: {
			width: "996px",
			fields: "50px"
		},
		sm: {
			width: "750px",
			fields: "30px"
		},
		s: {
			width: "576px",
			fields: "15px"
		},
		xs: {
			width: "440px",
			fields: "15px"
		},
		xxs: {
			width: "320px"
		}
	}
};




//Таск для очистки папки build
gulp.task('del', () => {
	return del(varDel)
});

//Таск для очистки папки build/img
gulp.task('img-del', () => {
	return del('./build/img/**/*')
});


//Таск обработки разметки
gulp.task('html', () => {
	return gulp.src('./src/*.html')
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream());
})


//Таск для обработки стилей
gulp.task('styles', () => {
	return gulp.src('./src/scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(gcmq())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 3 versions'],
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
gulp.task("scripts", () => {
	return gulp.src("./src/js/script.js")
		.pipe(webpackStr({
			mode: 'development',
			output: {
				filename: 'script.js'
			},
			watch: false,
			devtool: "source-map",
			plugins: [
				new webpack.ProvidePlugin({
				  $: 'jquery',
				  jQuery: 'jquery',
				  'window.jQuery': 'jquery'
				}),
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [['@babel/preset-env', {
									debug: true,
									corejs: 3,
									useBuiltIns: "usage"
								}]]
							}
						}
					}
				]
			}
		}))
		.pipe(gulp.dest('./build/js'))
		.on("end", browserSync.reload);
});

gulp.task("scripts-prod", () => {
	return gulp.src("./src/js/script.js")
		.pipe(webpackStr({
			mode: 'production',
			output: {
				filename: 'script.js'
			},
			plugins: [
				new webpack.ProvidePlugin({
				  $: 'jquery',
				  jQuery: 'jquery',
				  'window.jQuery': 'jquery'
				}),
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [['@babel/preset-env', {
									corejs: 3,
									useBuiltIns: "usage"
								}]]
							}
						}
					}
				]
			}
		}))
		.pipe(gulp.dest('./build/js'))
		.on("end", browserSync.reload);
});


// Таск для сжатия изображений и конвертации в WebP
gulp.task('img-compress1', () => {
	return gulp.src('./src/img/images/**/*.{jpg,png,svg}')
		.pipe(cache(
			imagemin([
				imgCompress({
					loops: 4,
					min: 65,
					max: 75,
					quality: 'high'
				}),
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 3 }),
				imageminPngquant({
					quality: [0.7, 0.9],
					speed: 1
				})
			]
			)))
		.pipe(gulp.dest('./build/img/images/'))
});

gulp.task('img-compress2', () => {
	return gulp.src('./src/img/images/**/*.{jpg,png}')
		.pipe(imageResize({ percentage: 200 }))
		.pipe(cache(
			imagemin([
				imgCompress({
					loops: 4,
					min: 65,
					max: 75,
					quality: 'high'
				}),
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 3 }),
				imageminPngquant({
					quality: [0.7, 0.9],
					speed: 1
				})
			]
			)))
		.pipe(rename(function (path) { path.basename += "-2x" }))
		.pipe(gulp.dest('./build/img/images/2x'))

});

gulp.task('img-compress', gulp.parallel('img-compress1', 'img-compress2'));


gulp.task('webp1', () => {
	return gulp.src('./src/img/images/**/[^bg-]*.{jpg,png}')
		.pipe(cache(
			imagemin({
				verbose: true,
				plugins: imageminWebp({ quality: 70 })
			}))
		)
		.pipe(rename(function (path) {
			path.extname = ".webp";
		}))
		.pipe(gulp.dest('./build/img/images'))
});

gulp.task('webp2', () => {
	return gulp.src('./src/img/images/**/[^bg-]*.{jpg,png}')
		.pipe(imageResize({ percentage: 200 }))
		.pipe(cache(
			imagemin({
				verbose: true,
				plugins: imageminWebp({ quality: 70 })
			}))
		)
		.pipe(rename(function (path) {
			path.basename += "-2x";
			path.extname = ".webp";
		}))
		.pipe(gulp.dest('./build/img/images/2x'))
});

gulp.task('webp', gulp.parallel('webp1', 'webp2'));


// Таск для создания SVG-спрайтов
gulp.task('svg', () => {
	return gulp.src('./src/img/svg/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(gulp.dest('./build/img/svg'));
});


//Таск для генерации сетки
gulp.task('grid', (done) => {
	settings;
	smartgrid('./src/libs', settings);
	done();
});



//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
	browserSync.init({
		server: {
			baseDir: "build"
		}
	});
	// Слежка за добавлением изображений
	gulp.watch('./src/img/images/**/*', gulp.series('img-compress', gulp.parallel('webp')))
	// Слежка за добавлением svg
	gulp.watch('./src/img/svg/*.svg', gulp.series('svg'))
	//Следить за файлами со стилями с нужным расширением
	gulp.watch('./src/scss/**/*.scss', gulp.series('styles'))
	//Следить за JS файлами
	gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
	// gulp.watch('./src/js/script/*.js', gulp.series('scriptsCustom', ))
	//При изменении HTML запустить синхронизацию
	gulp.watch('./src/**/*.html', gulp.series('html'));
});



//Таск по умолчанию. Запускает сборку
gulp.task('default', gulp.series('del', 'html', gulp.parallel('styles','scripts', 'img-compress', 'webp', 'svg'), 'watch'));
//Таск продакшэн. Запускает сборку
gulp.task('prod', gulp.series('del', 'html', gulp.parallel('styles','scripts-prod', 'img-compress', 'webp', 'svg'), 'watch'));
