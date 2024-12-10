/**
 * 模块导出，定义提交信息的校验配置
 * 本配置基于 '@commitlint/config-conventional'，并进行扩展
 * 主要用于确保提交消息的格式和类型符合规范
 */
module.exports = {
  // 继承自 conventional commit 规范的配置
  extends: ['@commitlint/config-conventional'],
  // 自定义的校验规则
  rules: {
    // 定义允许的提交类型
    'type-enum': [
      // 错误级别，2表示警告
      2,
      // 规则类型，'always' 表示必须遵守
      'always',
      // 允许的提交类型列表
      [
        // 新功能或特性
        'feat',
        // 修复bug
        'fix',
        // 文档更新
        'docs',
        // 格式化或美化代码
        'style',
        // 重构代码（既不修改功能也不修复bug）
        'refactor',
        // 性能优化
        'perf',
        // 添加或更新测试用例
        'test',
        // 构建系统或外部依赖项更改
        'build',
        // 连续集成系统配置更改
        'ci',
        // 一般性任务（如更新包管理器等）
        'chore',
        // 回滚前一次提交
        'revert'
      ]
    ],
    // 定义允许的作用范围
    'scope-enum': [
      // 错误级别，2表示警告
      2,
      // 规则类型，'always' 表示必须遵守
      'always',
      // 允许的作用范围列表
      ['core', 'ui', 'config', 'docs', 'tests']
    ],
    // 主题（subject）的大小写规则
    'subject-case': [
      // 错误级别，2表示警告
      2,
      // 规则类型，'always' 表示必须遵守
      'always',
      // 主题应使用句首大写（sentence-case）
      'sentence-case'
    ]
  }
};
