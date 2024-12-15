import { Component, Host, h, Element, Prop } from '@stencil/core'
import { Editor } from '@tiptap/core'
import { $t } from '@/i18n'

import {
  Bold,
  Italic,
  Strike,
  Underline,
  Highlight,
  FontColor,
  Subscript,
  Superscript,
  CodeLine,
  Link,
  Heading,
  Paragraph,
  textStyle,
  Color,
  StarterKit,
  Documnet,
  FontFamily,
  Blockquote,
  TextAlign,
  LineHeight,
  HardBreak,
  HorizontalRule,
  ListItem,
  BulletList,
  OrderedList,
  TaskList,
  TaskItem,
  FullScreen,
  Placeholder
} from '@/extensions/index'
@Component({
  tag: 'xy-editor',
  styleUrl: 'xy-editor.scss',
  shadow: true
})
export class XyEditor {
  @Element() el?: HTMLElement // 获取组件的根元素
  @Prop() lange: string = 'en' // 语言
  @Prop() menuBar: string[] = [
    'bold',
    'italic',
    'strike',
    'underline',
    'subscript',
    'superscript',
    'link',
    '|',
    'heading',
    'fontFamily',
    '|',
    'highlight',
    'fontColor',
    '|',
    'blockquote',
    'code',
    'codeBlock',
    '|',
    'textAlign',
    'lineHeight',
    'hardBreak',
    'horizontalRule',
    'orderedList',
    'bulletList',
    'taskList',
    '|',
    'table',
    'image',
    'fullScreen'
  ]
  @Prop() bubbleBar: string[] = ['bold', 'italic']
  @Prop() excludeBar: string[] = ['fontFamily']
  @Prop() extensions: any[] = []
  @Prop() content: string = ''
  @Prop() placeholder: string = '请输入内容'

  editor?: Editor
  render() {
    return (
      <Host class="editor-container">
        <div class="editor-header">
          <xy-menu-bar></xy-menu-bar>
        </div>
        <div class="editor-content"></div> {/* 编辑器的挂载容器 */}
      </Host>
    )
  }

  componentDidLoad() {
    if (this.el) {
      this.editor = new Editor({
        element: this.el?.shadowRoot?.querySelector('.editor-content')!, // 使用根元素获取子元素
        extensions: [StarterKit, Bold],
        content: this.content,
        editorProps: {
          attributes: {
            // 自定义样式
            class: 'custom-editor'
          }
        }
      })
    }
  }
  componentWillUnload() {
    if (this.editor) {
      this.editor.destroy() // 清理 editor 实例
    }
  }

  /**
   * 获取所有扩展
   */
  allExtensions = () => {
    // 默认扩展
    const coreExtensions = [
      StarterKit,
      textStyle,
      Color,
      Documnet,
      Placeholder.configure({
        placeholder: this.placeholder
      }),
      Paragraph.configure({
        draggable: true
      } as any),
      ListItem,
      TaskItem
    ]
    // 菜单扩展
    const menuExtensions = [
      Bold,
      Italic,
      Strike,
      Underline,
      Highlight,
      FontColor,
      Subscript,
      Superscript,
      CodeLine,
      Link,
      Heading,
      FontFamily,
      Blockquote,
      TextAlign,
      LineHeight,
      HardBreak,
      HorizontalRule,
      BulletList,
      OrderedList,
      TaskList,
      FullScreen,
      ...this.extensions
    ].filter(item => {
      return this.menuBar.includes(item.name)
    })
    return [...coreExtensions, ...menuExtensions]
  }
}
