# XyEditor 组件

**XyEditor** 是一个基于 **TipTap** 富文本编辑器的自定义组件，支持多种编辑功能和扩展，允许用户在页面中嵌入富文本编辑器，适用于文章编辑、富文本输入等场景。

该组件支持多语言、主题切换、菜单栏配置、扩展配置等，提供了灵活的编辑功能。

## 配置项

| 配置项        | 类型       | 默认值               | 说明                                                                      |
| ------------- | ---------- | -------------------- | ------------------------------------------------------------------------- |
| `language`    | `string`   | `'en'`               | 设置编辑器的语言，支持国际化。                                            |
| `menuBar`     | `string[]` | `[]`                 | 控制顶部菜单栏显示的功能，包含的功能包括：`bold`、`italic`、`strike` 等。 |
| `bubbleBar`   | `string[]` | `['bold', 'italic']` | 控制编辑器底部气泡菜单显示的功能。                                        |
| `excludeBar`  | `string[]` | `['fontFamily']`     | 设置哪些功能不显示在菜单栏中。                                            |
| `extensions`  | `any[]`    | `[]`                 | 自定义扩展，允许开发者根据需求增加额外功能。                              |
| `content`     | `string`   | `''`                 | 编辑器的初始内容，支持传入HTML或纯文本。                                  |
| `placeholder` | `string`   | `'请输入内容'`       | 编辑器的占位符文本。                                                      |
| `theme`       | `string`   | `'light'`            | 编辑器的主题，支持 `light` 和 `dark`。                                    |


## 使用示例

```html
<xy-editor
  language="en"
  menuBar="['bold', 'italic', 'underline', 'link', '|', 'heading', 'fontFamily']"
  bubbleBar="['bold', 'italic']"
  content="<p>Initial content</p>"
  placeholder="Type here..."
  theme="light">
</xy-editor>
```