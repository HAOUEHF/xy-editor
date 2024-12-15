import { Component, Prop, h } from '@stencil/core'
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

  render() {
    return (
      <div
        class="button-menu-item"
        data-name={this.data.props.name}
        data-shortcutKeys={this.data.props.shortcutKeys}
        onClick={() => this.handleCommand()}
      >
        <xy-icon name={this.data.props.icon}></xy-icon>
        <xy-icon name="DownIcon"></xy-icon>
      </div>
    )
  }

  componentWillLoad() {
    console.log(this.data)
  }

  private handleCommand() {
    if (this.data.props.disabled) return

    this.data.props.command?.()
  }
}
