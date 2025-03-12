import { Component, Prop, State, Host, h } from '@stencil/core'

@Component({
  tag: 'xy-dropdown-item',
  styleUrl: 'xy-dropdown-item.scss'
})
export class XyDropdownItem {
  @Prop() disabled: boolean = false
  @Prop() icon: string = ''
  render() {
    return (
      <Host class={{ 'xy-dropdown-item': true, 'is-disabled': this.disabled }}>
        {this.icon && (
          <div style={{ display: 'inline-block' }}>
            <xy-icon name={this.icon}></xy-icon>
          </div>
        )}
        <slot></slot>
      </Host>
    )
  }
}
