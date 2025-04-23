import { Component, Prop, State, h, Host, Element, getElement, Event, EventEmitter } from '@stencil/core'
import type { XYMenuBarItem } from '@/types/XYButtonMenu'
import { useTooltip } from '@/hooks'
import { Editor } from '@tiptap/core'
export interface IMenuItemProps {
  props: Partial<XYMenuBarItem>
  component?: any
  editor: Editor
  extensionName: string
}

@Component({
  tag: 'xy-button-menu',
  styleUrl: 'xy-button-menu.scss',
})
export class XYButtonMenu {
  @Prop() menuData: IMenuItemProps = {
    props: {},
    component: '',
    editor: {} as Editor,
    extensionName: ''
  }

  // 使用对象解构简化初始化
  @State() private buttonState: Pick<
    XYMenuBarItem,
    'isActive' | 'isDropdown' | 'name' | 'shortcutKeys' | 'icon' | 'command' | 'disabled' | 'component' | 'render'
  > = {
    isActive: this.menuData.props?.isActive ?? false,
    isDropdown: this.menuData.props?.isDropdown ?? false,
    name: this.menuData.props?.name ?? '',
    shortcutKeys: this.menuData.props?.shortcutKeys ?? '',
    icon: this.menuData.props?.icon ?? '',
    command: this.menuData.props?.command ?? (() => {}),
    disabled: this.menuData.props?.disabled ?? false,
    component: this.menuData?.component ?? '',
    render: this.menuData.props?.render ?? null
  }
  @State() isActive: boolean = false
  @Element() el!: HTMLElement
  @State() isDropdownShow: boolean = false
  @State() dropEl!: HTMLElement

  dropdownContent: HTMLElement | null = null

  @Event()
  handleCommand!: EventEmitter<any>

  private handleButtonClick = () => {
    if (this.buttonState.disabled) return
    if (this.buttonState.isDropdown) {
      return
    }
    // 执行命令并触发事件
    this.buttonState.command?.()
    this.handleCommand.emit()
  }

  componentWillLoad() {
    setTimeout(() => {
      const menuEl = this.el
      if (menuEl) {
        const xyEditor = getElement(document.querySelector('xy-editor'))
        const theme = xyEditor.getAttribute('theme')

        useTooltip({
          el: menuEl,
          props: {
            theme
          }
        })
      }
    }, 0)
  }

  async componentDidLoad() {}

  render() {
    const { isDropdown, name, shortcutKeys, icon, disabled, component, render } = this.buttonState
    if (render) {
      console.log(render)
    }
    return (
      <Host
        class={{
          'xy-button-menu': true,
          'xy-button-menu--active': this.menuData.props.isActive ?? false,
          'xy-button-menu--disabled': disabled
        }}
        data-name={name}
        data-shortcutKeys={shortcutKeys}
        onClick={this.handleButtonClick}
      >
        {icon && !render ? <xy-icon name={icon}></xy-icon> : render && render()}
        {isDropdown && <xy-icon name="DownIcon" width={10} height={10}></xy-icon>}
      </Host>
    )
  }
}
