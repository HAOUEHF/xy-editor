import tippy from 'tippy.js'

const useTooltip = (options: any) => {
  const { el, props } = options
  const tooltip = tippy(el, {
    content: (reference: Element) => {
      const name: string = reference.getAttribute('data-name')!
      const shortcutKeys: string = reference.getAttribute('data-shortcutKeys')!

      const template = `<div class="tool-name">${name}</div><div class="tool-keys">${shortcutKeys ? shortcutKeys : ''}</div>`
      return template
    },
    placement: 'top',
    theme: 'light',
    allowHTML: true,
    interactive: true,
    appendTo: () => document.body,
    hideOnClick: true,
    ...props
  })
  return tooltip
}

export default useTooltip
