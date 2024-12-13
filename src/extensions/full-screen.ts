import { Editor, Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fullScreen: {
      toggleFullScreen: () => ReturnType
    }
  }
}

const FullScreen = Extension.create({
  name: 'fullScreen',
  addOptions() {
    return {
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.commands.toggleFullScreen()
            },
            icon: 'FullScreenIcon',
            name: t('extensions.fullScreen'),
            isActive: editor.storage.fullScreen.fullScreen
          }
        }
      }
    }
  },
  addStorage() {
    return {
      fullScreen: false
    }
  },
  addCommands() {
    return {
      toggleFullScreen:
        () =>
        ({ editor }) => {
          const editorEl: HTMLDivElement = document.querySelector('.editor-container')!
          console.log(editor.storage.fullScreen)
          console.log(editorEl)
          const { fullScreen } = editor.storage.fullScreen
          if (fullScreen) {
            // 退出全屏
            editorEl.style.position = ''
            editorEl.style.width = ''
            editorEl.style.height = ''
            editorEl.style.top = ''
            editorEl.style.left = ''
            editorEl.style.zIndex = ''
            editor.storage.fullScreen = { fullScreen: false }
          } else {
            // 进入全屏
            const style = {
              width: '100%',
              height: 'calc(100vh - 2px)',
              position: 'fixed',
              top: '0',
              left: '0',
              'z-index': '99',
              overflow: 'auto'
            } as any
            for (const key in style) {
              editorEl.style[key as any] = style[key]
            }
            editor.storage.fullScreen = { fullScreen: true }
          }
          return false
        }
    }
  }
})

export default FullScreen
