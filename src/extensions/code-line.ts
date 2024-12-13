import type { Editor } from '@tiptap/core'
import TiptapCode, { CodeOptions } from '@tiptap/extension-code'

const CodeLine = TiptapCode.extend<CodeOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleCode().run()
            },
            isActive: editor.isActive('code'),
            icon: 'CodeIcon',
            name: t('extensions.codeLine'),
            shortcutKeys: 'Ctrl+E'
          }
        }
      }
    }
  }
})

export default CodeLine
