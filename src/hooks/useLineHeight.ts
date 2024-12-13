import { Transaction, TextSelection, AllSelection, EditorState } from '@tiptap/pm/state'
import { NodeType, Node as ProsemirrorNode } from '@tiptap/pm/model'
interface SetLineHeightTask {
  node: ProsemirrorNode
  nodeType: NodeType
  pos: number
}
const useLineHeight = () => {
  const commandsLineHeight = (lineHeight: string) => {
    return ({ state, dispatch }: { state: any; dispatch: any }) => {
      let { selection, tr } = state

      tr = tr.setSelection(selection)
      tr = setTextLineHeight(tr, lineHeight)

      if (tr.docChanged) {
        dispatch && dispatch(tr)
        return true
      }

      return false
    }
  }
  const setTextLineHeight = (tr: Transaction, lineHeight: string): Transaction => {
    const { selection, doc } = tr
    if (!selection || !doc) return tr

    if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
      return tr
    }

    const { from, to } = selection

    const tasks: Array<SetLineHeightTask> = []
    const lineHeightValue = lineHeight || null

    doc.nodesBetween(from, to, (node, pos) => {
      const nodeType = node.type
      if (['paragraph', 'heading'].includes(nodeType.name)) {
        const lineHeight = node.attrs.lineHeight || null
        if (lineHeight !== lineHeightValue) {
          tasks.push({
            node,
            pos,
            nodeType
          })
          return nodeType.name !== 'list_item' && nodeType.name !== 'todo_item'
        }
      }
      return true
    })

    if (!tasks.length) return tr
    tasks.forEach(task => {
      const { node, pos, nodeType } = task
      let { attrs } = node

      attrs = {
        ...attrs,
        lineHeight: lineHeightValue
      }

      tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks)
    })

    return tr
  }
  const isActive = (state: EditorState, lineHeight: string): { active: boolean; value: string } => {
    let active = false
    let value = ''

    const { tr } = state
    if (!tr.selection) return { active, value }

    tr.doc.nodesBetween(tr.selection.from, tr.selection.to, node => {
      const nodeType = node.type
      if (['paragraph', 'heading'].includes(nodeType.name)) {
        const lineHeightValue = node.attrs.lineHeight || null
        value = lineHeightValue
        active = lineHeightValue === lineHeight
      }
    })
    return { active, value }
  }
  return {
    commandsLineHeight,
    isActive
  }
}

export default useLineHeight
