import type { Editor } from '@tiptap/core'
import TiptapSuperscript, { SuperscriptExtensionOptions } from '@tiptap/extension-superscript'

const Superscript = TiptapSuperscript.extend<SuperscriptExtensionOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleSuperscript().run()
            },
            isActive: editor.isActive('superscript'),
            icon: 'SuperscriptIcon',
            name: t('extensions.superscript'),
            shortcutKeys: 'Ctrl+.'
          }
        }
      }
    }
  }
})

export default Superscript
