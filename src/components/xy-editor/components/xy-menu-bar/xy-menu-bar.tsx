import { Component, Prop, State, h, Host } from '@stencil/core'
import type { Editor } from '@tiptap/core'
import { $t } from '@/i18n'

@Component({
  tag: 'xy-menu-bar',
  styleUrl: 'xy-menu-bar.scss'
})
export class XyMenuBar {
  @Prop() editor?: Editor
  @Prop() menuBar?: any

  @State() menuBarList: any[] = []
  @State() cachedButtons: any[] = []
  render() {
    // this.getMenuBarList()

    return (
      <Host class="editor-memu">
        {this.menuBarList.map((item: any) => (item.props?.icon ? <xy-button-menu data={item}></xy-button-menu> : null))}
      </Host>
    )
  }

  getMenuBarList() {
    // 这里可以获取到传递过来的 menuBar 属性
    console.log(this.generateCommandButton())

    this.menuBarList = this.menuBar
      .map((item: string) => {
        if (item === '|') {
          return '|'
        } else {
          return this.generateCommandButton().find((v: any) => v.extensionName === item)
        }
      })
      .filter((item: any) => item !== undefined)
    console.log('menuBarList in getMenuBarList', this.menuBarList)
  }

  generateCommandButton = () => {
    if (!this.editor) return []

    const extensionManager = this.editor.extensionManager
    if (!extensionManager) return []

    return (
      extensionManager.extensions
        .reduce((acc: any[], extension: any) => {
          const { button } = extension.options
          if (!button || typeof button !== 'function') return acc

          const menuBtnComponentSpec = button({
            editor: this.editor,
            t: $t,
            extension
          })
          // const component = componentsView[extension.name]

          if (Array.isArray(menuBtnComponentSpec)) {
            return [
              ...acc,
              ...menuBtnComponentSpec.map(item => ({
                ...item,
                editor: this.editor,
                // component,
                priority: extension.options.priority || 0,
                disabled: extension.options.disabled || false,
                extensionName: extension.name
              }))
            ]
          }

          return [
            ...acc,
            {
              ...menuBtnComponentSpec,
              // component,
              editor: this.editor,
              priority: extension.options.priority || 0,
              disabled: extension.options.disabled || false,
              extensionName: extension.name
            }
          ]
        }, [])
        ?.sort((a: any, b: any) => b.priority - a.priority) || []
    )
  }
  componentDidLoad() {
    this.getMenuBarList()
  }
}
