import { Component, Prop, State, h, Host, Element, getElement, Event, EventEmitter } from '@stencil/core'
import type { XYMenuBarItem } from '@/types/XYButtonMenu'
import { useTooltip, useDropdown } from '@/hooks'
import { Instance, Props } from 'tippy.js'
import { Editor } from '@tiptap/core'
export interface IMenuItemProps {
  props: Partial<XYMenuBarItem>
  component?: any
  editor: Editor
  extensionName: string
}

@Component({
  tag: 'xy-button-menu',
  styleUrl: 'xy-button-menu.scss'
})
export class XYButtonMenu {
  @Prop() menuData: IMenuItemProps = {
    props: {},
    component: '',
    editor: {} as Editor,
    extensionName: ''
  }

  // 使用对象解构简化初始化
  @State() private buttonState: Pick<
    XYMenuBarItem,
    'isActive' | 'isDropdown' | 'name' | 'shortcutKeys' | 'icon' | 'command' | 'disabled' | 'component'
  > = {
    isActive: this.menuData.props?.isActive ?? false,
    isDropdown: this.menuData.props?.isDropdown ?? false,
    name: this.menuData.props?.name ?? '',
    shortcutKeys: this.menuData.props?.shortcutKeys ?? '',
    icon: this.menuData.props?.icon ?? '',
    command: this.menuData.props?.command ?? (() => {}),
    disabled: this.menuData.props?.disabled ?? false,
    component: this.menuData?.component ?? ''
  }
  @State() isActive: boolean = false
  @Element() el!: HTMLElement
  @State() isDropdownShow: boolean = false
  @State() tippyDropdown!: Instance<Props>
  @State() dropEl!: HTMLElement

  dropdownContent: HTMLElement | null = null

  @Event()
  handleCommand!: EventEmitter<any>
  private handleButtonClick = () => {
    if (this.buttonState.disabled) return
    this.dropEl = this.el
    if (this.buttonState.isDropdown && this.tippyDropdown) {
      console.log('dropdownContent', this.tippyDropdown)

      this.tippyDropdown.show()

      return
    }

    this.buttonState.command?.()
    this.handleCommand.emit()
  }

  componentWillLoad() {
    setTimeout(() => {
      // 组件加载时的初始化逻辑
      const menuEl = this.el
      // console.log(menuEl)
      if (menuEl) {
        const xyEditor = getElement(document.querySelector('xy-editor'))
        const theme = xyEditor.getAttribute('theme')
        useTooltip({ el: menuEl, props: { theme } })

        this.dropdownContent = getElement(this.el).querySelector('.dropdown-content')

        if (this.buttonState.isDropdown && this.buttonState.component && this.dropdownContent) {
          console.log(this.buttonState)
          const { instanceDropdown } = useDropdown({
            contentEl: this.dropdownContent,
            triggerEl: this.dropdownContent,
            customShow: (instance: Instance<Props>) => {
              instance.setProps({
                getReferenceClientRect: () => this.dropEl.getBoundingClientRect()
              })
            },
            customHide: () => {
              this.menuData.editor.commands.focus()
            }
          })
          this.tippyDropdown = instanceDropdown
        }
      }
    }, 0)
  }
  async componentDidLoad() {}

  render() {
    const { isDropdown, name, shortcutKeys, icon, disabled, component } = this.buttonState

    return (
      <Host
        class={{
          'xy-button-menu': true,
          'xy-button-menu--active': this.menuData.props.isActive ?? false,
          'xy-button-menu--disabled': disabled
        }}
        data-name={name}
        data-shortcutKeys={shortcutKeys}
        onClick={this.handleButtonClick}
      >
        {icon && <xy-icon name={icon}></xy-icon>}
        {isDropdown && <xy-icon name="DownIcon" width={10} height={10}></xy-icon>}
        {isDropdown && component ? (
          <div class="dropdown-content">
            {h(component['$tag$'], { attrs: { ...this.menuData.props }, name: this.menuData.extensionName })}
          </div>
        ) : null}
      </Host>
    )
  }
}
