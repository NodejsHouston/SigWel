/// <reference path="typings/node/node.d.ts"/>
/**
* Dependencies.
*/
var gulp = require('gulp');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')(); //Automatically load gulp plugins

var port = process.env.PORT || config.defaultPort;

// the default task that is run with the command 'gulp'
gulp.task('default', function () {
    // assets is where you define your application assets and you can pass them into gulp.
    var assets = require('./src/assets');
    
    // change the working directory to the public folder, where your assets are located.
    var gulpFileCwd = __dirname + '/src/public';
    process.chdir(gulpFileCwd);
    // print the working directory
    $.util.log('Working directory changed to', $.util.colors.magenta(gulpFileCwd));

    // concat and minify your css
    gulp.src(assets.development.css)
        .pipe($.concat('styles.css'))
        .pipe($.minifyCss())
        .pipe(gulp.dest('./css/'));

    // concat and minify your js
    gulp.src(assets.development.js)
        .pipe($.concat('scripts.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./js/'));

    // optimize your images
    gulp.src('./images/*')
        .pipe($.imagemin())
        .pipe(gulp.dest('./images/'));

});

/**
 * serve the dev environment
 */
gulp.task('serve-dev', function () {
    serve(true /*isDev*/);
});

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev) {
    var nodeOptions = {
        script: isDev ? config.nodeServer.dev : config.nodeServer.build
      , delayTime: 1
      , ext: 'html'
      , env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'development' : 'build'
        }
      , watch: config.server
    };

    return $.nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** nodemon restart');
            log('files changed on restart:\n' + ev)
        })
        .on('start', function () {
            log('*** nodemon started');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        })
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
