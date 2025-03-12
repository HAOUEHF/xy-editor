import { Component, Prop, State, Host, h, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'xy-dropdown-item',
  styleUrl: 'xy-dropdown-item.scss'
})
export class XyDropdownItem {
  @Prop() disabled: boolean = false
  @Prop() icon: string = ''

  @Event()
  dropdownItemClick!: EventEmitter<void>
  handleClick = (e: MouseEvent) => {
    console.log(e)
    if (this.disabled) return
    this.dropdownItemClick.emit()
  }
  render() {
    return (
      <Host class={{ 'xy-dropdown-item': true, 'is-disabled': this.disabled }} onClick={this.handleClick}>
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
