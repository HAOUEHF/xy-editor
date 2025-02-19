import type { Editor } from '@tiptap/core'
import TiptapBold, { BoldOptions } from '@tiptap/extension-bold'

const Bold = TiptapBold.extend<BoldOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        console.log(editor.isActive('bold'));

        return {
          props: {
            command: () => {
              editor.chain().focus().toggleBold().run()
            },
            isActive: editor.isActive('bold'),
            icon: 'BoldIcon',
            name: t('extensions.bold'),
            shortcutKeys: 'Ctrl+B'
          }
        }
      }
    }
  }
})

export default Bold
