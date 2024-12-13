import { Editor } from '@tiptap/core'
import TiptapImage, { ImageOptions } from '@tiptap/extension-image'

const Image = TiptapImage.extend<ImageOptions & { disabled: boolean }>({
  inline() {
    return true
  },
  group() {
    return 'inline'
  },
  addOptions() {
    return {
      ...this.parent?.(),
      allowBase64: true,
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (options: { src: string; alt?: string; title?: string }) => {
              console.log(options)
              editor.chain().blur().setImage(options).run()
            },
            icon: 'ImageIcon',
            name: t('extensions.image'),
            isActive: editor.isActive('image'),
            isDropdown: true
          }
        }
      }
    }
  },
  addAttributes() {
    let defaultWidth = 400
    let defaultHeight = 400
    return {
      ...this.parent?.(),
      width: {
        default: defaultWidth,
        parseHTML(element) {
          const width = element.style.width || element.getAttribute('width')
          console.log(element)

          return width
        },
        renderHTML: attributes => {
          const { width } = attributes
          return {
            width
          }
        }
      },
      height: {
        default: defaultHeight,
        parseHTML(element) {
          const height = element.style.height || element.getAttribute('height')
          return height
        },
        renderHTML: attributes => {
          const { height } = attributes
          return {
            height
          }
        }
      },
      display: {
        default: 'inline-block',
        parseHTML(element) {
          const displayVal = element.getAttribute('data-display') || element.getAttribute('display')
          return displayVal
        },
        renderHTML: attributes => {
          return { ['data-display']: attributes.display }
        }
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]'
      }
    ]
  },
})

export default Image
