import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
const Paste = Extension.create({
  name: 'paste',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('paste'),
        props: {
          handlePaste(view, event, slice) {
            console.log(view, event, slice)
          }
        }
      })
    ]
  }
})

export default Paste
