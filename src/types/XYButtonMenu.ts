import type { VNode } from '@stencil/core'
export interface XYMenuBarItem {
  command: Function
  isActive: boolean
  icon: string
  name: string
  shortcutKeys: string
  disabled: boolean
  isDropdown?: boolean
  component?: VNode
}
