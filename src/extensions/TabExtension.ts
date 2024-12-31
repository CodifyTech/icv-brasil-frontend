import { Extension } from '@tiptap/core'

export const TabExtension = Extension.create({
  name: 'tab',

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const { commands } = editor
        const { state, dispatch } = editor.view
        const { tr } = state
        const { from, to } = state.selection

        // Inserir 2 espaços ao pressionar Tab
        const tabSpaces = '  '

        tr.insertText(tabSpaces, from, to)

        dispatch(tr)

        return true
      },
    }
  },
})
