import { Component, Prop, State, h, Host } from '@stencil/core'
import type { Editor } from '@tiptap/core'

@Component({
  tag: 'xy-menu-bar',
  styleUrl: 'xy-menu-bar.scss'
})
export class XyMenuBar {
  @Prop() editor?: Editor
  @Prop() menuBar?: any

  @State() data = {
    props: {
      icon: 'BoldIcon'
    }
  }
  render() {
    return (
      <Host class="editor-memu">
        <xy-button-menu data={this.data}></xy-button-menu>
      </Host>
    )
  }
}
