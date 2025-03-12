import { Component, Prop, State, Host, h } from '@stencil/core'

@Component({
  tag: 'xy-dropdown-menu',
  styleUrl: 'xy-dropdown-menu.scss'
})
export class XyDropdownMenu {
  render() {
    return (
      <Host class="xy-dropdown-menu">
        <slot></slot>
      </Host>
    )
  }
}
