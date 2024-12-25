import { Component, Prop, State, h, Host } from '@stencil/core'
import type { XYMenuBarItem } from '@/types/XYButtonMenu'

export interface MenuItem {
  props: Partial<XYMenuBarItem>
}

@Component({
  tag: 'xy-button-menu',
  styleUrl: 'xy-button-menu.scss'
})
export class XyButtonMenu {
  @Prop() data: MenuItem = { props: {} }

  @State() isActive: XYMenuBarItem['isActive'] = this.data.props?.isActive || false
  @State() isDropdown: XYMenuBarItem['isDropdown'] = this.data.props?.isDropdown || false
  @State() name: XYMenuBarItem['name'] = this.data.props?.name || ''
  @State() shortcutKeys: XYMenuBarItem['shortcutKeys'] = this.data.props?.shortcutKeys || ''
  @State() icon: XYMenuBarItem['icon'] = this.data.props?.icon || ''
  @State() command: XYMenuBarItem['command'] = this.data.props?.command || (() => {})
  @State() disabled: XYMenuBarItem['disabled'] = this.data.props?.disabled || false

  render() {
    return (
      <Host
        class="button-menu-item"
        data-name={this.name}
        data-shortcutKeys={this.shortcutKeys}
        onClick={() => this.handleCommand()}
      >
        <xy-icon name={this.icon}></xy-icon>
        {this.isDropdown && <xy-icon name="DownIcon" width={10} height={10}></xy-icon>}
      </Host>
    )
  }

  componentWillLoad() {}

  private handleCommand() {
    if (this.disabled) return

    this.command?.()
  }
}
