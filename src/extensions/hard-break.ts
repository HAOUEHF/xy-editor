import { Editor } from '@tiptap/core'
import TiptapHardBreak, { HardBreakOptions } from '@tiptap/extension-hard-break'

const HardBreak = TiptapHardBreak.extend<HardBreakOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().setHardBreak().run()
            },
            icon: 'HardBreakIcon',
            name: t('extensions.hardBreak')
          }
        }
      }
    }
  }
})

export default HardBreak
