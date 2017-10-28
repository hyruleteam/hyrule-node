const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const GulpSSH = require('gulp-ssh');
const plumber = require('gulp-plumber');

const serverPath = './Server';
const devPath = './Client';
const distPath = './Static';

//browser-sync
gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'http://localhost:3000',
        port: 4000,
        open: false,
        notify: false
    });
});

//html
gulp.task('buildHtml', () => {
    return gulp.src([`${devPath}/html/**/*.html`, `!${devPath}/html/include/*.html`])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(`${distPath}/html`))
});

//style
gulp.task('buildStyle', () => {
    return gulp.src(`${devPath}/sass/*.scss`)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${distPath}/css/`))
        .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
});

//js
gulp.task('buildJs', () => {
    const pageJs = gulp.src([`${devPath}/js/pages/**/*.js`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/js/pages/`));

    const vendorJs = gulp.src([`${devPath}/js/vendor/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/js/vendor/`));

    return merge(pageJs, vendorJs);
});

//images
gulp.task('buildImages', () => {
    return gulp.src([`${devPath}/images/**/*`, `!${devPath}/images/sprites/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/images/`))
});

//sprites
const argv = require('minimist')(process.argv.slice(2));

const spritesMithConfig = {
    imgName: argv.name + '.png',
    cssName: '_' + argv.name + '.scss',
    cssFormat: 'scss',
    algorithm: 'binary-tree',
    imgPath: '../images/sprite/' + argv.name + '.png',
    padding: 10
}

gulp.task('buildSprite', () => {
    const spriteData =
        gulp.src(`${devPath}/images/sprites/${argv.name}/*`)
        .pipe(plumber())
        .pipe(spritesmith(spritesMithConfig));

    spriteData.img.pipe(gulp.dest(`${devPath}/images/sprite`));
    spriteData.img.pipe(gulp.dest(`${distPath}/images/sprite`));
    spriteData.css.pipe(gulp.dest(`${devPath}/sass/module/icon`));
});

//clean
gulp.task('buildClean', () => {
    return gulp.src([`${distPath}`])
        .pipe(plumber())
        .pipe(clean({
            force: true
        }))
});

//devPack
gulp.task('devPack', ['buildHtml', 'buildStyle', 'buildJs', 'buildImages']);

//buildPack
gulp.task('buildPack', ['devPack'], () => {
    const styles = gulp.src(`${distPath}/css/*.css`)
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions', '> 5%']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(`${distPath}/css/`));

    const js = gulp.src(`${distPath}/js/pages/*.js`)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(`${distPath}/js/`));

    const images = gulp.src([`${distPath}/images/**/*`])
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(`${distPath}/images/`));

    return merge(styles, js, images);
});

//nodemon
gulp.task('nodemon', cb => {
    let started = false;

    return nodemon({
        script: `${serverPath}/bin/www`,
        ext: 'js',
        ignore: [
            `${distPath}/`,
            `${devPath}/`
        ],
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('default', ['devPack', 'nodemon', 'browser-sync'], () => {
    gulp.watch([
            `${distPath}/**/*.+(css|js|png|jpg|ttf)`,
            `${serverPath}/views/**/*.art`
        ])
        .on('change', browserSync.reload);

    gulp.watch([`${devPath}/sass/**/*.scss`], ['buildStyle']);
    gulp.watch([`${devPath}/js/**/*`], ['buildJs']);
    gulp.watch([`${devPath}/images/**/*`], ['packImages']);
});


let config = require('./Config/build/config.build');
let sshConfig = config.dev;
// 打开ssh通道
const gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: sshConfig.ssh
})

gulp.task('execSSH', () => {
    return gulpSSH.shell(sshConfig.commands, { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'))
});

gulp.task('deployFile', () => {
    return gulp
        .src(['./public/**'])
        .pipe(gulpSSH.dest(sshConfig.remoteDir))
});

gulp.task('prd', ['execSSH'], () => {
    gulp.run('deployFile');
});

//buildBootstrap
gulp.task('buildBootstrap', () => {
    return gulp.src('./Client/./Client/qwui/sass/bootstrap/bootstrap.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions', '> 5%']
        }))
        .pipe(minifycss())
        .pipe(rename('js/vendor/bootstrap/css/bootstrap.min.css'))
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
});