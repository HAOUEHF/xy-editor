import type { Editor } from '@tiptap/core'
import TiptapHighlight, { HighlightOptions } from '@tiptap/extension-highlight'

const Highlight = TiptapHighlight.extend<HighlightOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (val: string) => editor.chain().focus().toggleHighlight({ color: val }).run(),
            unsetCommand: () => editor.chain().focus().unsetHighlight().run(),
            isActive: editor.isActive('highlight'),
            icon: 'HighlightIcon',
            name: t('extensions.highlight'),
            isDropdown: true
          }
        }
      }
    }
  }
})

export default Highlight
