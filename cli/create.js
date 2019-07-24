const path = require('path');
const fse = require('fs-extra');

let resolve = dir => path.resolve(__dirname, '..', dir);
let name = process.argv[2];
let template = resolve('common/template');
let target = resolve(`src/${name}`);

catchError(name, target);

fse.copy(template, target)
  .then(() => console.log(`已成功新建项目：${target}`))
  .catch(err => console.error(err));

function catchError(name, target) {
  if (name == null) {
    console.log('缺少项目名称：npm run create <new-project>');
    process.exit(0);
  }
  
  if (fse.pathExistsSync(target)) {
    console.log(`${target}已存在，请使用其他项目名`);
    process.exit(0);
  }
}