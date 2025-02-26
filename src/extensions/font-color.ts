import { Extension, Editor } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontColor: {
      setFontColor: (fontColor: string) => ReturnType
      unsetFontColor: () => ReturnType
    }
  }
}

const FontColor = Extension.create({
  name: 'fontColor',
  addOptions() {
    return {
      types: ['textStyle'],
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (val: string) => {
              editor.chain().focus().setFontColor(val).run()
              console.log(editor.isActive('textStyle'));

            },
            unsetCommand: () => editor.chain().focus().unsetFontColor().run(),
            isActive: editor.isActive('textStyle'),
            icon: 'FontColorIcon',
            name: t('extensions.fontColor'),
            shortcutKeys: '',
            isDropdown: true
          }
        }
      }
    }
  },
  addCommands() {
    return {
      setFontColor:
        (fontColor: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { color: fontColor }).run()
        },
      unsetFontColor:
        () =>
        ({ chain }) => {
          return chain().unsetMark('textStyle').run()
        }
    }
  }
})

export default FontColor
