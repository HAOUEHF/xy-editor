import { Component, Prop, State, Host, h, Event, EventEmitter, getElement, Element } from '@stencil/core'

@Component({
  tag: 'xy-dropdown-item',
  styleUrl: 'xy-dropdown-item.scss'
})
export class XyDropdownItem {
  @Element() el!: HTMLElement
  @Prop() disabled: boolean = false
  @Prop() icon: string = ''
  @Prop() data: any = {}
  @Event()
  dropdownItemClick!: EventEmitter<void>
  handleClick = (e: MouseEvent) => {
    console.log(e)
    const parent = getElement(this).parentElement
    // if (this.disabled || parent?.getAttribute('data-tag') === 'popover-trigger') return
    // this.dropdownItemClick.emit(this.data)
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
