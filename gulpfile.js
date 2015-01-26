var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
// unused module
//var rimraf = require('rimraf'); // rimraf directly
var grimraf = require('gulp-rimraf');
var replace = require('gulp-replace');
// lint tool
var jshint = require('gulp-jshint');
// lint report tool
var stylish = require('jshint-stylish');
var config = require('./config.json');
var argv = require('yargs').argv;
// unit test
var karma = require('karma').server;

gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/config/karma.conf.js'
    }, done);
});

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('lint', function() {
    return gulp.src('./www/js/*/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
// APP 环境自动配置 + 启动
// 启动测试环境:
// gulp serve --evr=test
// 启动开发环境:
// TODO
gulp.task('serve', function() {
    var configfile = '';
    console.log(argv);
    if(null == argv.evr || undefined == argv.evr) {
        configfile = 'var globeObj = ' + JSON.stringify(config.online) + ';';
        gutil.log("default evr online");
    } else {
        if(null == argv.domain || undefined == argv.domain) {
            configfile = 'var globeObj = ' + JSON.stringify(config[argv.evr]) + ';';
            gutil.log(config[argv.evr]);
        } else if(argv.domain == "no") {
            // 不强行设置domain
            config[argv.evr].domain = undefined;
            configfile = 'var globeObj = ' + JSON.stringify(config[argv.evr]) + ';';
            gutil.log(config[argv.evr]);
        }
    }
    var fs = require('fs');
    fs.writeFile('./www/js/config.js', configfile, function (err) {
      if (err) throw err;
      gutil.log('config file saved success');
      sh.exec('ionic serve');
    });
});

gulp.task('upload', function() {
    sh.exec('cp -rf /home/niko/workspace/qianmi/store-wx/www/* /home/niko/fromServ/ROOT && cp -rf /home/niko/workspace/weChatpay/build/classes/* /home/niko/fromServ/ROOT/WEB-INF/classes/ && scp -r /home/niko/fromServ/* root@172.19.23.5:/home/tomcat/tomcat/webapps/');
});
gulp.task('uploadweb', function() {
    sh.exec('cp -rf /home/niko/workspace/store-wx/www/* /home/niko/fromServ/weidian && scp -r /home/niko/fromServ/weidian/* root@172.19.65.89:/home/tomcat/tomcat/webapps/weidian/');
});

gulp.task('ngmin', function () {
    return gulp.src('./www/js/**/*.js')
        .pipe(ngmin({dynamic: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
    return gulp.src('./www/js/**/*.js')
        .pipe(concat('all.min.js'))
        //.pipe(ngmin({dynamic: false}))
        //.pipe(stripDebug())
        //.pipe(uglify({outSourceMap: false}))
        //.pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('push', function (){
    var targetDir = '/Users/zhangxitao/work/wx/src/main/webapp/'; //更新wx
//    var targetDir = '/Users/zhangxitao/work/weidian/weidian-web/src/main/webapp/';  //更新微信服务
    sh.cp('-rf', './www/css/*', targetDir + 'css');
    sh.cp('-rf', './www/templates/*', targetDir + 'templates');
    sh.cp('-rf', './dist/all.min.js', targetDir + 'js');

    if (!sh.which('git')) {
        sh.echo('Sorry, this script requires git');
        sh.exit(1);
    } else {
        sh.cd(targetDir);
        sh.exec('git checkout master');
        sh.exec('git pull');
        sh.exec('git add . ');
        sh.exec('git commit -m "auto update" ');
        sh.exec('git push ');
        sh.echo('push to git ok');
    }

});

gulp.task('copy', function() {
    gulp.src('./www/css/*').pipe(gulp.dest('./dest/www/css'));
    gulp.src('./www/images/*').pipe(gulp.dest('./dest/www/images'));
    gulp.src('./www/templates/**/*.html').pipe(gulp.dest('./dest/www/templates'));

    gulp.src('./www/lib/CryptoJS/**/*.js').pipe(gulp.dest('./dest/www/lib/CryptoJS'));
    gulp.src('./www/lib/ionic/font/*').pipe(gulp.dest('./dest/www/lib/ionic/font'));
    gulp.src('./www/lib/ionic/**/*').pipe(gulp.dest('./dest/www/lib/ionic/'));

    gulp.src('./www/lib/ionic/js/ionic.bundle.min.js').pipe(gulp.dest('./dest/www/lib/ionic/js'));
   // gulp.src('./www/index.min.html').pipe(rename('index.html')).pipe(gulp.dest('./dest/www'));

});

gulp.task('del', function() {

    gulp.src('./www/css/*').pipe(gulp.dest('./dest/www/css'));
    gulp.src('./www/images/*').pipe(gulp.dest('./dest/www/images'));
    gulp.src('./www/templates/*').pipe(gulp.dest('./dest/www/templates'));

    gulp.src('./www/lib/CryptoJS/*').pipe(gulp.dest('./dest/www/lib/CryptoJS'));

    gulp.src('./www/lib/ionic/js/ionic.bundle.min.js').pipe(gulp.dest('./dest/www/lib/ionic/js'));

    gulp.src('./dest/www/mock', { read: false }) // much faster
        // .pipe(ignore('node_modules/**'))
        .pipe(grimraf());

    gulp.src('./dest/www/templates/statics', { read: false }) // much faster
        .pipe(grimraf());

    gulp.src('./dest/www/res', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/css/ionic.app.css', { read: false }).pipe(grimraf());

    gulp.src('./dest/www/lib/angular', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/angular-animate', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/angular-sanitize', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/angular-ui-router', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/angular-ui-router', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/scss', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/css', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/js/ionic-angular.js', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/js/ionic-angular.min.js', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/js/ionic.js', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/js/ionic.min.js', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/js/ionic.bundle.js', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/css', { read: false }).pipe(grimraf());
    gulp.src('./dest/www/lib/ionic/README.md', { read: false }).pipe(grimraf());


});

gulp.task('rep', function(){
    gulp.src('./www/index.html')
        .pipe(replace( "ionic.bundle.js" , "ionic.bundle.min.js"))
        .pipe(replace( "ionic.app.css", "ionic.app.min.css"))

        .pipe(gulp.dest('./dest/www/'));
});

gulp.task('release', ['sass','minify','copy']);
