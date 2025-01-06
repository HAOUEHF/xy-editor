import { Component, Host, h, Element, Prop, State, getElement } from '@stencil/core'
import { Editor, Extension } from '@tiptap/core'

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
  Document,
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
  @Prop() lang: string = 'en' // 语言
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
  @Prop() theme: string = 'light'

  @State() editor?: Editor
  @State() menuBarList: string[] = []

  render() {
    return (
      <Host class="editor-container" data-theme={this.theme}>
        <div class="editor-header">
          {this.editor ? <xy-menu-bar menuBar={this.menuBarList} editor={this.editor}></xy-menu-bar> : null}
        </div>
        <div class="editor-content"></div> {/* 编辑器的挂载容器 */}
      </Host>
    )
  }

  /**
   * 获取所有扩展
   */
  allExtensions = (): Extension[] => {
    // 默认扩展
    const coreExtensions = [
      StarterKit,
      textStyle,
      Color,
      Document,
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

  getMenuBarList = () => {
    this.menuBarList = this.menuBar.filter(item => !this.excludeBar.includes(item))
  }

  componentWillUnload() {
    if (this.editor) {
      this.editor.destroy() // 清理 editor 实例
    }
  }
  componentWillLoad() {
    console.log('父生命周期：componentWillLoad')
    this.getMenuBarList()
  }

  componentDidLoad() {
    console.log('父生命周期：componentDidLoad')
    console.log(this.el, this.el?.shadowRoot?.querySelector('.editor-content'))
    if (this.el) {
      this.editor = new Editor({
        element: this.el?.shadowRoot?.querySelector('.editor-content')!, // 使用根元素获取子元素
        extensions: [...this.allExtensions()],
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
}
