import { Editor } from '@tiptap/core'
import TiptapFontFamily from '@tiptap/extension-font-family'
import type { FontFamilyOptions } from '@tiptap/extension-font-family'

const familyData = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times',
  'Verdana',
  'Courier New',
  'Georgia',
  'Tahoma',
  'Garamond',
  'Comic Sans MS'
]

const FontFamily = TiptapFontFamily.extend<FontFamilyOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor }: { editor: Editor }) {
        return {
          props: {
            command: (fontFamily: string) => {
              editor.chain().focus().setFontFamily(fontFamily).run()
            },
            options: familyData.map(item => {
              return {
                label: item,
                value: item
              }
            }),
            activeText: '测试'
          }
        }
      }
    }
  }
})

export default FontFamily
