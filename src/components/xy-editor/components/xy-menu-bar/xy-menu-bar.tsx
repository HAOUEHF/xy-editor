import { Component, Prop, State, h, Host, Listen } from '@stencil/core'
import type { Editor } from '@tiptap/core'
import { $t } from '@/i18n'

// 定义菜单按钮的类型接口
interface MenuButtonSpec {
  extensionName: string // 扩展名称
  editor: Editor // 编辑器实例
  priority: number // 优先级，用于排序
  disabled: boolean // 是否禁用
  props?: {
    icon?: string // 图标
    [key: string]: any // 其他属性
  }
  [key: string]: any
}

@Component({
  tag: 'xy-menu-bar',
  styleUrl: 'xy-menu-bar.scss'
})
export class XyMenuBar {
  // 接收编辑器实例
  @Prop() editor: Editor | null = null
  // 接收菜单栏配置
  @Prop() menuBar?: string[]

  // 存储处理后的菜单列表
  @State() menuBarList: (MenuButtonSpec | string | undefined)[] = []
  @State() cachedMenuBarList: (MenuButtonSpec | string | undefined)[] = []
  @State() componentsView: any = {
    link: <xy-drop-link></xy-drop-link>
  }

  /**
   * 生成命令按钮配置
   * 处理编辑器扩展中定义的按钮配置，生成最终的按钮列表
   */
  private generateCommandButton = (): MenuButtonSpec[] => {
    if (!this.editor?.extensionManager) return []

    return (
      this.editor.extensionManager.extensions
        .reduce((acc: MenuButtonSpec[], extension: any) => {
          // 获取扩展中定义的按钮配置函数
          const { button } = extension.options
          if (!button || typeof button !== 'function') return acc

          // 执行按钮配置函数获取配置信息
          const menuBtnComponentSpec = button({
            editor: this.editor,
            t: $t,
            extension
          })
          const component = this.componentsView[extension.name]

          // 处理返回数组的情况（一个扩展可能定义多个按钮）
          if (Array.isArray(menuBtnComponentSpec)) {
            return [
              ...acc,
              ...menuBtnComponentSpec.map(item => ({
                ...item,
                editor: this.editor,
                component,
                priority: extension.options.priority ?? 0,
                disabled: extension.options.disabled ?? false,
                extensionName: extension.name
              }))
            ]
          }

          // 处理返回单个配置的情况
          return [
            ...acc,
            {
              ...menuBtnComponentSpec,
              editor: this.editor,
              component,
              priority: extension.options.priority ?? 0,
              disabled: extension.options.disabled ?? false,
              extensionName: extension.name
            }
          ]
        }, [])
        // 根据优先级排序
        .sort((a, b) => b.priority - a.priority)
    )
  }

  /**
   * 根据menuBar配置生成最终的菜单列表
   * 处理分隔符'|'并过滤出需要显示的按钮
   */
  private getMenuBarList(): void {
    this.cachedMenuBarList = this.generateCommandButton()
    this.menuBarList =
      this.menuBar
        ?.map((item: string) =>
          item === '|' ? item : this.cachedMenuBarList.find((v: any) => v.extensionName === item)
        )
        .filter(Boolean) ?? []
  }

  handleEditorUpdate = () => {
    this.getMenuBarList()
  }

  @Listen('handleCommand')
  handleCommand() {
    this.getMenuBarList()
  }
  async componentWillLoad() {
    this.getMenuBarList()
  }
  /**
   * 组件加载完成后初始化菜单列表
   */
  async componentDidLoad() {
    if (this.editor) {
      this.editor.on('selectionUpdate', this.handleEditorUpdate)
      this.editor.on('update', this.handleEditorUpdate)
    }
  }

  render() {
    return (
      <Host class="editor-menu-bar">
        {this.menuBarList.map((item: any) =>
          item.props?.icon ? (
            <xy-button-menu menuData={item}></xy-button-menu>
          ) : item === '|' ? (
            <div class="divider"></div>
          ) : null
        )}
      </Host>
    )
  }
}
