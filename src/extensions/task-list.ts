import { Editor } from '@tiptap/core'
import TiptapTaskList, { TaskListOptions } from '@tiptap/extension-task-list'

const TaskList = TiptapTaskList.extend<TaskListOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleTaskList().run()
            },
            isActive: editor.isActive('taskList'),
            icon: 'TaskListIcon',
            name: t('extensions.taskList'),
            shortcutKeys: 'Ctrl+Shift+9'
          }
        }
      }
    }
  }
})

export default TaskList
