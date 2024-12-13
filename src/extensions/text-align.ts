import { Editor } from '@tiptap/core'
import TiptapTextAlign, { TextAlignOptions } from '@tiptap/extension-text-align'

const TextAlign = TiptapTextAlign.extend<TextAlignOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['heading', 'paragraph'],
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (val: string, item: any) => {
              editor.chain().focus().setTextAlign(val).run()
              editor.storage.textAlignIcon = item.label
            },
            options: [
              { label: 'AlignLeftIcon', value: 'left', isActive: editor.isActive({ textAlign: 'left' }) },
              { label: 'AlignCenterIcon', value: 'center', isActive: editor.isActive({ textAlign: 'center' }) },
              { label: 'AlignRightIcon', value: 'right', isActive: editor.isActive({ textAlign: 'right' }) },
              { label: 'AlignJustifyIcon', value: 'justify', isActive: editor.isActive({ textAlign: 'justify' }) }
            ],
            activeIcon: editor.storage.textAlignIcon || 'AlignLeftIcon',
            name: t('extensions.textAlign')
          }
        }
      }
    }
  }
})

export default TextAlign
