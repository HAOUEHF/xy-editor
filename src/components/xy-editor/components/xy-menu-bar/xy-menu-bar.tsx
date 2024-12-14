import { Component, Prop, State, h, Host } from '@stencil/core'
import type { Editor } from '@tiptap/core'

@Component({
  tag: 'xy-menu-bar',
  styleUrl: 'xy-menu-bar.scss'
})
export class XyMenuBar {
  @Prop() editor?: Editor
  @Prop() menuBar?: any

  render() {
    return (
      <Host class="editor-memu flex items-center gap-2 h-auto flex-wrap">
      </Host>
    )
  }
}
