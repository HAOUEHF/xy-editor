import type { Editor } from '@tiptap/core'
import TiptapSubscript, { SubscriptExtensionOptions } from '@tiptap/extension-subscript'

const Subscript = TiptapSubscript.extend<SubscriptExtensionOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleSubscript().run()
            },
            isActive: editor.isActive('subscript'),
            icon: 'SubscriptIcon',
            name: t('extensions.subscript'),
            shortcutKeys: 'Ctrl+,'
          }
        }
      }
    }
  }
})

export default Subscript
