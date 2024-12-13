import { Editor } from '@tiptap/core'
import TiptapBulletList, { BulletListOptions } from '@tiptap/extension-bullet-list'

const BulletList = TiptapBulletList.extend<BulletListOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleBulletList().run()
            },
            isActive: editor.isActive('bulletList'),
            icon: 'BulletListIcon',
            name: t('extensions.bulletList'),
            shortcutKeys: 'Ctrl+Shift+8'
          }
        }
      }
    }
  }
})

export default BulletList
