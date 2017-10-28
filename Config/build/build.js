let chalk = require('chalk')
let ora = require('ora')

let spawn = require('child_process').spawn

let spinner = ora('正在发布资源...')
spinner.start()

let uploadFile = spawn('gulp', ['prd'])

uploadFile.stdout.on('data', (data) => {
    console.log(`${data}`);
});

uploadFile.on('exit', () => {
    console.log(chalk.cyan('  发布成功.\n'))
    spinner.stop()
});