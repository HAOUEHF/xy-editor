import type { Editor } from '@tiptap/core'
import TipTapLink, { LinkOptions } from '@tiptap/extension-link'
import { h } from '@stencil/core'
type Props = {
  href: string
  target?: string | null
  rel?: string | null
  class?: string | null
}

const Link = TipTapLink.extend<LinkOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (props: Props) => {
              console.log(props)

              editor.chain().focus().toggleLink(props).run()
            },
            isActive: editor.isActive('link'),
            icon: 'LinkIcon',
            name: t('extensions.link'),
            shortcutKeys: '',
            isDropdown: true,
            href: editor.getAttributes('link').href || '',
            target: editor.getAttributes('link').target || null,
            rel: editor.getAttributes('link').rel || null,
            class: editor.getAttributes('link').class || null,
            render: () => {
              return h('xy-popover', {}, [h('xy-icon', { name: 'LinkIcon', slot: 'trigger' }), h('xy-drop-link')])
            }
          }
        }
      }
    }
  }
})

export default Link
