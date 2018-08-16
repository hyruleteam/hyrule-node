const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const spritesmith = require('gulp.spritesmith');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const comments = require('postcss-discard-comments');
const px2rem = require('postcss-px2rem');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');

const rollup = require('gulp-rollup');
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve');

const rev = require('gulp-revm');
const revCollector = require('gulp-revm-collector');

const config = require('config');
const appConfig = config.get('Customer.appConfig');

//编译路径
const serverPath = './server';
const devPath = './client';
const distPath = './static';
const buildPath = './dist';

const buildHtml = () => {
    return gulp
        .src([`${serverPath}/views/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/views`))
}

const buildStyle = () => {
    const plugins = [
        px2rem({remUnit: 75}),
        autoprefixer(['iOS >= 7', 'Android >= 4.1']),
        comments()
    ];

    return gulp
        .src([`${devPath}/sass/*.scss`,`!${devPath}/sass/vant.scss`])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(changed(`${distPath}/css/`, {
            hasChanged: changed.compareContents,
            extension: '.css'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${distPath}/css/`))
}

const buildLibStyle = () => {
    const plugins = [
        px2rem({remUnit: 37.5}),
        autoprefixer(['iOS >= 7', 'Android >= 4.1']),
        comments()
    ];

    return gulp
        .src(`${devPath}/sass/vant.scss`)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest(`${distPath}/css/`))
}

//读取入口文件
const readFile = (path) =>
    new Promise((res, rej) => {
        fs.readdir(path, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })

const readEntryFile = async () =>{
    const filePath = path.join(__dirname, `${devPath}/js`)

    const readdirfile = await readFile(filePath)

    return readdirfile
        .filter(el => /\.js/.test(el))
        .map(item => `${devPath}/js/${item}`)
}

const buildJs = async () => {
    const fileList = await readEntryFile()
    return gulp
        .src([`${devPath}/js/**/*.js`])
        .pipe(plumber())
        .pipe(changed(`${distPath}/js/`, {hasChanged: changed.compareContents}))
        .pipe(sourcemaps.init())
        .pipe(rollup({
            input: fileList,
            output: {
                format: 'es'
            },
            plugins: [
                resolve(),
                babel({
                    exclude: 'node_modules/**',
                    babelrc: false,
                    presets: [['@babel/preset-env', {modules: false}]]
                })
            ]
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(`${distPath}/js/`))
}

const buildImages = () => {
    return gulp
        .src([`${devPath}/images/**/*`, `!${devPath}/images/sprites/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/images/`))
}

const buildLib = () => {
    return gulp
        .src([`${devPath}/lib/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/lib/`))
}

const buildFonts = () => {
    return gulp
        .src([`${devPath}/font/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/font/`))
}

//browser-sync
gulp.task('browser-sync', () => {
    browserSync.init({proxy: `http://localhost:${appConfig.port}`, port: 4000, open: false, notify: false});
});

//html
gulp.task('buildHtml', () => {
    return watch(`${serverPath}/views/**/*`, () => {
        buildHtml()
            .pipe(browserSync.stream());
    })
});

//style
gulp.task('buildStyle', () => {
    return watch(`${devPath}/sass/**/*.scss`, () => {
        buildStyle()
            .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
    })
});

//js
gulp.task('buildJs', () => {
    return watch(`${devPath}/js/**/*.js`, () => {
        buildJs()
            .pipe(browserSync.stream());
    })
});

//images
gulp.task('buildImages', () => {
    return watch(`${devPath}/images/**/*`, () => {
        buildImages()
            .pipe(browserSync.stream())
    })
});

//font
gulp.task('buildFonts', () => {
    return watch(`${devPath}/font/**/*`, () => {
        buildFonts()
            .pipe(browserSync.stream())
    })
});

//lib
gulp.task('buildLib', () => {
    return watch(`${devPath}/lib/**/*`, () => {
        buildLib()
            .pipe(browserSync.stream());
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
    const spriteData = gulp
        .src(`${devPath}/images/sprites/${argv.name}/*`)
        .pipe(plumber())
        .pipe(spritesmith(spritesMithConfig));

    spriteData
        .img
        .pipe(gulp.dest(`${devPath}/images/sprite`));
    spriteData
        .img
        .pipe(gulp.dest(`${distPath}/images/sprite`));
    spriteData
        .css
        .pipe(gulp.dest(`${devPath}/sass/module/icon`));
});

//clean
gulp.task('buildClean', () => {
    return gulp
        .src([`${distPath}`])
        .pipe(plumber())
        .pipe(clean({force: true}))
});

//devPack
gulp.task('devPack', ['buildHtml', 'buildStyle', 'buildJs', 'buildImages', 'buildFonts']);

//buildAssets
gulp.task('buildAssets', ['buildClean'], () => {
    buildHtml();
    buildStyle();
    buildLibStyle()
    buildJs();
    buildImages();
    buildFonts();
    buildLib();
});

//nodemon
gulp.task('nodemon', cb => {
    let sthtmled = false;

    return nodemon({
        script: `${serverPath}/bin/www`,
        ext: 'js',
        ignore: [`${distPath}/`, `${devPath}/`]
    }).on('sthtml', () => {
        if (!sthtmled) {
            cb();
            sthtmled = true;
        }
    });
});

gulp.task('default', [
    'devPack', 'nodemon', 'browser-sync'
], () => {
    gulp
        .watch([`${distPath}/**/*.+(css|js|png|jpg|ttf)`, `${serverPath}/views/**/*.ejs`])
        .on('change', browserSync.reload);
});

//打包server端代码
gulp.task('buildServerFile',()=>{
    return gulp
        .src([`${serverPath}/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${buildPath}/`))
})

gulp.task('buildRevHtml',()=>{
    return gulp
        .src([`${buildPath}/static/rev/**/*.json`,`${buildPath}/views/**/*.ejs`])
        .pipe(plumber())
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(`${buildPath}/views`))
})

gulp.task('buildServerJs',['buildServerFile'],()=>{
    return gulp
        .src([`${buildPath}/**/*.js`,`!${buildPath}/static/lib/*.js`])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(`${buildPath}/`))
})

//打包client端代码

gulp.task('buildClientFile',()=>{
    buildStyle()
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(rev())
        .pipe(gulp.dest(`${buildPath}/static/css/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${buildPath}/static/rev/css`))

    buildLibStyle().pipe(gulp.dest(`${buildPath}/static/css/`))
    buildJs()
        .pipe(rev())
        .pipe(gulp.dest(`${buildPath}/static/js`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${buildPath}/static/rev/js`))

    buildImages().pipe(gulp.dest(`${buildPath}/static/images`))
    buildFonts().pipe(gulp.dest(`${buildPath}/static/fonts`))
    buildLib().pipe(gulp.dest(`${buildPath}/static/lib`))
})


//清理文件
gulp.task('buildDistClean',()=>{
    return gulp
        .src([`${buildPath}`])
        .pipe(plumber())
        .pipe(clean({force: true}))
})

//打包文件
gulp.task('buildPack',['buildServerJs', 'buildClientFile'],()=>{

})
