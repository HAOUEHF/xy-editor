import { Plugin } from 'rollup';
import { readFileSync } from 'fs';
import { extname } from 'path';

export default function svgToComponent(): Plugin {
  return {
    name: 'svg-to-component',
    // 在 transform 阶段处理 .svg 文件
    transform(_, id) {
      if (extname(id) !== '.svg') {
        return null; // 如果不是 SVG 文件，跳过处理
      }

      // 读取 SVG 文件内容
      const svgContent = readFileSync(id, 'utf-8')
        .replace(/'/g, "\\'") // 转义单引号
        .replace(/(\r\n|\n|\r)/gm, ''); // 删除换行符

      // 返回一个可以导入的 JavaScript 模块
      return {
        code: `export default \`${svgContent}\`;`, // 返回 JavaScript 代码
        map: { mappings: '' }, // 空的 source map
      };
    },
  };
}
