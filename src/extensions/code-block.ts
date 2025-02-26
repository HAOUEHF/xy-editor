import { Editor } from '@tiptap/core'
import TiptapCodeBlockLowlight, { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'

// import { createLowlight, common } from 'lowlight'

const CodeBlock = TiptapCodeBlockLowlight.extend<CodeBlockLowlightOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      // lowlight: createLowlight(common),
      // defaultLanguage: 'js',
      // defaultLanguagesData: ['js', 'css', 'html', 'php', 'python', 'java', 'c', 'go'],
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        // console.log(extension)
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleCodeBlock().run()
            },
            isActive: editor.isActive('codeBlock'),
            icon: 'CodeBlockIcon',
            name: t('extensions.codeBlock')
          }
        }
      }
    }
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      theme: {
        default: '主题1',
        parseHTML: element => {
          return element.getAttribute('data-theme')
        }
      }
    }
  }
})

export default CodeBlock
