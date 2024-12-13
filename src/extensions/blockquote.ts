import { Editor } from '@tiptap/core'
import TiptapBlockquote, { BlockquoteOptions } from '@tiptap/extension-blockquote'

const Blockquote = TiptapBlockquote.extend<BlockquoteOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleBlockquote().run()
            },
            isActive: editor.isActive('blockquote'),
            icon: 'BlockQuoteIcon',
            name: t('extensions.blockquote'),
            shortcutKeys: 'Ctrl+Shift+B'
          }
        }
      }
    }
  }
})

export default Blockquote
