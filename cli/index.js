const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

let mode = process.argv[2];// 'development' | 'production'
let project = process.argv[3];

catchError(project);
build(project);

function build(project){
  let spinner = ora(chalk.cyan('Now building...\n'));
  let commands = {
    production: `cross-env NODE_ENV=production project=${project} webpack --progress --hide-modules`,
    development: `cross-env NODE_ENV=development project=${project} webpack-dev-server --color`
  };
  
  spinner.start();
  let p = exec(commands[mode]);
  
  // 打印子进程的 console
  p.stdout.on('data', (stats) => {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n');
  
    spinner.stop();
  });
  
  // 打印错误子进程的 console
  p.stderr.on('data', (err) => {
    process.stdout.write(err.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n');
  
    spinner.stop();
  });
}

function catchError(project){
  let targetPath = path.resolve(__dirname, '../src', project);
  let logWarn = msg => console.log(chalk.yellow(msg));

  if (process.argv.length < 4) {
    logWarn(`未指定项目名称: \`npm run ${mode === 'production' ? 'build' : 'dev'} <project>\``);
    process.exit();
  }

  if (!fs.existsSync(targetPath)) {
    logWarn(`${targetPath}不存在: 请检查项目名称是否正确`);
    process.exit();
  }
}