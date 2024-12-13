import { Editor } from '@tiptap/core'
import TiptapOrderedList, { OrderedListOptions } from '@tiptap/extension-ordered-list'

const OrderedList = TiptapOrderedList.extend<OrderedListOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleOrderedList().run()
            },
            isActive: editor.isActive('orderedList'),
            icon: 'OrderedListIcon',
            name: t('extensions.orderedList'),
            shortcutKeys: 'Ctrl+Shift+7'
          }
        }
      }
    }
  }
})

export default OrderedList
