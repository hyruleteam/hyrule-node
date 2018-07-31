const gulp = require('gulp');
const minifyCSS = require('gulp-minify-css');
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
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');

const rev = require('gulp-revm');
const revCollector = require('gulp-revm-collector');

//编译路径
const serverPath = './server';
const devPath = './app';
const distPath = './dist';

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
    return watch(`${devPath}/views/**/*.html`, () => {
        gulp.src([`${devPath}/views/**/*.html`])
            .pipe(plumber())
            .pipe(changed(`${distPath}/views`, {
                hasChanged: changed.compareContents,
                extension: '.html'
            }))
            .pipe(gulp.dest(`${distPath}/views`))
            .pipe(browserSync.stream());
    })
});

//style
gulp.task('buildStyle', () => {
    return watch(`${devPath}/sass/**/*.scss`, () => {
        gulp.src(`${devPath}/sass/*.scss`)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(changed(`${distPath}/css/`, {
                hasChanged: changed.compareContents,
                extension: '.css'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(`${distPath}/css/`))
            .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
    })
});

//js
gulp.task('buildJs', () => {
    const pageJs = watch(`${devPath}/js/pages/**/*.js`, () => {
        gulp.src([`${devPath}/js/pages/**/*.js`])
            .pipe(plumber())
            .pipe(changed(`${distPath}/js/pages/`, {
                hasChanged: changed.compareContents
            }))
            .pipe(gulp.dest(`${distPath}/js/pages/`))
            .pipe(browserSync.stream());
    })

    const vendorJs = watch(`${devPath}/js/vendor/**/*`, () => {
        gulp.src([`${devPath}/js/vendor/**/*`])
            .pipe(plumber())
            .pipe(gulp.dest(`${distPath}/js/vendor/`))
            .pipe(browserSync.stream());
    })

    return merge(pageJs, vendorJs);
});

//images
gulp.task('buildImages', () => {
    return watch(`${devPath}/images/**/*`, () => {
        gulp.src([`${devPath}/images/**/*`, `!${devPath}/images/sprites/**/*`])
            .pipe(plumber())
            .pipe(gulp.dest(`${distPath}/images/`))
            .pipe(browserSync.stream())
    })
});
//font
gulp.task('buildFont', () => {
    return watch(`${devPath}/font/**/*`, () => {
        gulp.src([`${devPath}/font/**/*`])
            .pipe(plumber())
            .pipe(gulp.dest(`${distPath}/font/`))
            .pipe(browserSync.stream())
    })
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
gulp.task('devPack', ['buildHtml', 'buildStyle', 'buildJs', 'buildImages', 'buildFont']);

//buildPack
gulp.task('buildAssets', ['buildClean'], () => {
    const html = gulp.src([`${devPath}/views/**/*.html`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/views/`))

    const styles = gulp.src([`${devPath}/sass/*.scss`])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${distPath}/css/`))

    const pagejs = gulp.src(`${devPath}/js/pages/**/*.js`)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(`${distPath}/js/pages`));

    const vendorJs = gulp.src([`${devPath}/js/vendor/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/js/vendor/`))

    const fonts = gulp.src([`${devPath}/font/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/font/`))

    const images = gulp.src([`${devPath}/images/**/*`, `!${devPath}/images/sprites/**/*`])
        .pipe(gulp.dest(`${distPath}/images/`))
        .pipe(rev())
        .pipe(gulp.dest(`${distPath}/images/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${distPath}/rev/images`));

    return merge(html, styles, pagejs, vendorJs, fonts,images);
});

gulp.task('buildRevPack', ['buildAssets'], () => {
    const styles = gulp.src([`${distPath}/css/*.css`])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions', '> 5%']
        }))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest(`${distPath}/css/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${distPath}/rev/css`))

    return merge(styles);
})

gulp.task('buildPack', ['buildRevPack'], () => {
    gulp.src([`${distPath}/rev/**/*.json`, `${serverPath}/views/**/*.art`])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(`${serverPath}/views`));
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
});
