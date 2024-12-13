import type { Editor } from '@tiptap/core'
import TiptapStrike, { StrikeOptions } from '@tiptap/extension-strike'

const Strike = TiptapStrike.extend<StrikeOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleStrike().run()
            },
            isActive: editor.isActive('strike'),
            icon: 'StrikeIcon',
            name: t('extensions.strike'),
            shortcutKeys: 'Ctrl+Shift+S'
          }
        }
      }
    }
  }
})

export default Strike
