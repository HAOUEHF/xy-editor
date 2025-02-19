import tippy, { Instance, Props } from 'tippy.js'

type Options = {
  contentEl: HTMLElement
  triggerEl: HTMLElement
  customShow?: (instance: Instance<Props>) => void
  customHide?: (instance: Instance<Props>) => void
  props?: any
}
const useDropdown = (options: Options) => {
  const { triggerEl, contentEl, customShow, customHide, props } = options
  console.log('useDropdown', options);

  let instanceDropdown: any = null
  let isShowInProgress = false // 用于防止 show 被重复触发
  let isHideInProgress = false // 用于防止 hide 被重复触发

  instanceDropdown = tippy(triggerEl, {
    // 传整个元素过去，不能只传html，这样会触发不了事件
    content: contentEl,
    trigger: 'manual', // 手动触发
    placement: 'bottom',
    allowHTML: true,
    interactive: true,
    theme: 'dropdown',
    appendTo: () => document.body,
    arrow: false,
    hideOnClick: true,
    maxWidth: 1000,
    onShow(instance) {
      if (isShowInProgress) return // 如果 show 正在进行中，则跳过
      isShowInProgress = true // 标记 show 操作开始
      if (customShow) {
        customShow(instance)
        console.log('customShow');

      }
      isShowInProgress = false // 操作完成后重置标志
    },
    onHide(instance) {
      if (isHideInProgress) return // 如果 hide 正在进行中，则跳过
      isHideInProgress = true // 标记 hide 操作开始
      if (customHide) {
        customHide(instance)
        console.log('customHide');

      }
      isHideInProgress = false // 操作完成后重置标志
    },
    ...props
  })

  return {
    instanceDropdown
  }
}

export default useDropdown
