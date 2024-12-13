import { Editor } from '@tiptap/core'
import TiptapHorizontalRule, { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'

const HorizontalRule = TiptapHorizontalRule.extend<HorizontalRuleOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().setHorizontalRule().run()
            },
            icon: 'HorizontalRuleIcon',
            name: t('extensions.horizontalRule')
          }
        }
      }
    }
  }
})

export default HorizontalRule
