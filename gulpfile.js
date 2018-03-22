var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-sass' ),
	browserSync 	= require( 'browser-sync' ),
	concat 			= require( 'gulp-concat' ),
	uglify 			= require( 'gulp-uglifyjs' ),
	cssnano 		= require( 'gulp-cssnano' ),
	rename 			= require( 'gulp-rename' ),
	imagemin 		= require( 'gulp-imagemin' ),
	pngquant		= require( 'imagemin-pngquant' ),
	cache			= require( 'gulp-cache' ),
	autoprefixer 	= require( 'gulp-autoprefixer' );

gulp.task( 'sass', function() {
	return gulp.src( 'app/sass/*.sass' )
		.pipe( sass({ outputStyle: 'expanded'}).on('error', sass.logError ) )
		.pipe( autoprefixer( [ 'last 15 versions' ] ) )
		.pipe( gulp.dest( 'app/css/' ) )
		.pipe( browserSync.reload( { stream: true } ) );
});	

gulp.task( 'browser-sync', function() {
	return browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task( 'scripts', function() {
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/owl.carousel/dist/owl.carousel.min.js'
		])
		.pipe( concat( 'libs.min.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( 'app/js/' ) );
});

gulp.task( 'css-libs', ['sass'] , function() {
	return gulp.src( 'app/css/libs.css' )
		.pipe( cssnano() )
		.pipe( rename( { suffix : '.min' } ) )
		.pipe( gulp.dest( 'app/css' ) )
});

gulp.task( 'img', function() {
	return gulp.src( 'app/img/*' )
		.pipe( cache( imagemin({
			interlaced : true,
			progressive: true,
			svgoPlugins: [{ removeViewBox:false }],
			use: [ pngquant() ]
		}) ) )
		.pipe( gulp.dest( 'dist/img' ) );
});

gulp.task( 'clean', function() {
	return del.sync( 'dist' );
});

gulp.task( 'clear', function() {
	return cache.clearAll();
});

gulp.task( 'watch', [ 'browser-sync', 'css-libs', 'scripts', ], function() {
	gulp.watch( 'app/sass/main.sass', [ 'sass' ] );
	gulp.watch( 'app/js/main.js', browserSync.reload );
	gulp.watch( 'app/**/*.html', browserSync.reload );
});

gulp.task( 'build', [ 'clean', 'css-libs', 'img', 'scripts' ], function() {
	var buildCss = gulp.src([
			'app/css/main.css',
			'app/css/libs.min.css'
		])
		.pipe( gulp.dest( 'dist/css' ) );

	var buildFonts = gulp.src( 'app/fonts/*' )
		.pipe( gulp.dest( 'dist/fonts' ) ); 	

	var buildJs = gulp.src( 'app/js/*' )
		.pipe( gulp.dest( 'dist/js' ) );

	var buildHTML = gulp.src( 'app/**/*.html' )
		.pipe( gulp.dest( 'dist' ) ); 		
});

gulp.task( 'default', [ 'watch' ] );