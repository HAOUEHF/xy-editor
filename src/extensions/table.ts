import type { Editor, Extension } from '@tiptap/core'
import TiptapTable, { TableOptions } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

const Table = TiptapTable.extend<TableOptions & { disabled: boolean; components: Record<string, any> }>({
  addOptions() {
    return {
      ...this.parent?.(),
      resizable: true,
      components: {},
      button({ editor, extension, t }: { editor: Editor; extension: Extension; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (_val:any, item:any) => {
              item.command()
            },
            icon: 'TableIcon',
            name: t('extensions.table'),
            isDropdown: true,
            options: [
              {
                label: t('dropTable.insertTable'),
                value: 'insertTable',
                component: extension.options.components['insertTable'],
                isDropdown: true,
                editor
              },
              {
                label: t('dropTable.addRowBefore'),
                value: 'addRowBefore',
                command: () => {
                  editor.chain().focus().addRowBefore().run()
                }
              },
              {
                label: t('dropTable.addRowAfter'),
                value: 'addRowAfter',
                command: () => {
                  editor.chain().focus().addRowAfter().run()
                }
              },
              {
                label: t('dropTable.deleteRow'),
                value: 'deleteRow',
                command: () => {
                  editor.chain().focus().deleteRow().run()
                }
              },
              {
                label: t('dropTable.addColumnBefore'),
                value: 'addColumnBefore',
                command: () => {
                  editor.chain().focus().addColumnBefore().run()
                }
              },
              {
                label: t('dropTable.addColumnAfter'),
                value: 'addColumnAfter',
                command: () => {
                  editor.chain().focus().addColumnAfter().run()
                }
              },
              {
                label: t('dropTable.deleteColumn'),
                value: 'deleteColumn',
                command: () => {
                  editor.chain().focus().deleteColumn().run()
                }
              },
              {
                label: t('dropTable.mergeCells'),
                value: 'mergeCells',
                command: () => {
                  editor.chain().focus().mergeCells().run()
                }
              },
              {
                label: t('dropTable.splitCells'),
                value: 'splitCells',
                command: () => {
                  editor.chain().focus().splitCell().run()
                }
              },
              {
                label: t('dropTable.deleteTable'),
                value: 'deleteTable',
                command: () => {
                  editor.chain().focus().deleteTable().run()
                }
              }
            ]
          }
        }
      }
    }
  },
  addExtensions() {
    return [TableRow, TableHeader, TableCell]
  }
})

export default Table
