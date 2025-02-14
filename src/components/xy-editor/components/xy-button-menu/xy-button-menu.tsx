import { Component, Prop, State, h, Host, Element } from '@stencil/core'
import type { XYMenuBarItem } from '@/types/XYButtonMenu'
import { useTooltip } from '@/hooks'
export interface IMenuItemProps {
  props: Partial<XYMenuBarItem>
}

@Component({
  tag: 'xy-button-menu',
  styleUrl: 'xy-button-menu.scss'
})
export class XYButtonMenu {
  @Prop() menuData: IMenuItemProps = { props: {} }

  // 使用对象解构简化初始化
  @State() private buttonState: Pick<
    XYMenuBarItem,
    'isActive' | 'isDropdown' | 'name' | 'shortcutKeys' | 'icon' | 'command' | 'disabled'
  > = {
    isActive: this.menuData.props?.isActive ?? false,
    isDropdown: this.menuData.props?.isDropdown ?? false,
    name: this.menuData.props?.name ?? '',
    shortcutKeys: this.menuData.props?.shortcutKeys ?? '',
    icon: this.menuData.props?.icon ?? '',
    command: this.menuData.props?.command ?? (() => {}),
    disabled: this.menuData.props?.disabled ?? false
  }

  @Element() el!: HTMLElement

  render() {
    const { isActive, isDropdown, name, shortcutKeys, icon, disabled } = this.buttonState

    return (
      <Host
        class={{
          'xy-button-menu': true,
          'xy-button-menu--active': isActive,
          'xy-button-menu--disabled': disabled
        }}
        data-name={name}
        data-shortcutKeys={shortcutKeys}
        onClick={this.handleButtonClick.bind(this)}
      >
        {icon && <xy-icon name={icon}></xy-icon>}
        {isDropdown && <xy-icon name="DownIcon" width={10} height={10}></xy-icon>}
      </Host>
    )
  }

  private handleButtonClick = (): void => {
    if (this.buttonState.disabled) {
      return
    }

    this.buttonState.command?.()
  }

  componentDidLoad() {
    // 组件加载时的初始化逻辑
    const menuEl = this.el
    // console.log(menuEl)
    if (menuEl) {
      useTooltip({ el: menuEl })
    }
  }
}
