import { Component, Prop, State, Host, h } from '@stencil/core'

@Component({
  tag: 'xy-dropdown-group',
  styleUrl: 'xy-dropdown-group.scss'
})
export class XyDropdownGroup {
  @Prop() label: string = ''

  componentWillLoad() {

  }
  render() {
    return (
      <Host class="xy-dropdown-group" data-label={this.label} role="group">
        <div class="xy-dropdown-group__label" role="group-label">
          {this.label}
        </div>
        <div class="xy-dropdown-group__content" role="group">
          <slot></slot>
        </div>
        <div class="xy-dropdown-group__divider"></div>
      </Host>
    )
  }
}
