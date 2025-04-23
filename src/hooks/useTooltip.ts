import tippy from 'tippy.js'

type IUseTooltip = {
  el: HTMLElement
  props: any
}
const useTooltip = (options: IUseTooltip) => {
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
    interactive: false,
    appendTo: () => document.body,
    hideOnClick: true,
    ...props
  })
  return tooltip
}

export default useTooltip
