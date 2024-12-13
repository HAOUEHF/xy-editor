const fs = require('fs');
const path = require('path');

// icons 文件夹路径
const iconsDir = path.join(__dirname, '');

// 读取文件夹中的所有 SVG 文件
const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));

// 将文件名转换为 PascalCase
const toPascalCase = (str) =>
  str
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase()) // 转换每个 - 后的字母为大写
    .replace(/(^\w)/, (match) => match.toUpperCase())      // 转换首字母为大写
    .replace('.svg', '');                                  // 移除文件扩展名

// 创建导出语句
const exportsList = svgFiles.map(file => {
  const name = toPascalCase(file);
  return `export { default as ${name}Icon } from './${file}';`;
});

// 将导出语句写入到 index.ts 文件中
const indexPath = path.join(iconsDir, 'index.ts');
fs.writeFileSync(indexPath, exportsList.join('\n'));

console.log('执行成功');
