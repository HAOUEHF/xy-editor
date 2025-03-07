import { Component, Element, Host, h, Prop, State, Fragment, getElement } from '@stencil/core'
import { useDropdown } from '@/hooks'
import { Instance, Props } from 'tippy.js'

@Component({
  tag: 'xy-select',
  styleUrl: 'xy-select.scss'
})
export class XySelect {
  @Element() el!: HTMLElement

  @Prop() activeValue: any = null
  @Prop() disabled: boolean = false
  @Prop() attrs: any = {}

  // 新增分组配置类型
  @Prop() groupField: string = 'group' // 分组字段名
  @Prop() groupLabel: string = 'label' // 分组标题字段名

  @State() isDropdownShow = false
  private dropdownContent: HTMLElement | null = null
  private componentView: any
  private itemData: any = null
  private tippyDropdown: any
  private dropEl: any | null = null

  // 判断是否是分组数据
  private isGrouped(options: any[]) {
    return options.some(item => item[this.groupField])
  }

  // 抽离公共项渲染逻辑
  renderItem = (item: any) => {
    console.log(item)
    return (
      <div
        class={{
          'xy-select-item': true,
          [item.class || '']: true,
          'is-active': this.activeValue === item.value || item.isActive || false,
          'is-disabled': item.disabled
        }}
        onClick={e => !item.disabled && this.handleSelect(item, e)}
        key={item.value}
      >
        {item.label.includes('Icon') ? (
          <x-icon name={item.label} style={{ pointerEvents: 'none' }} />
        ) : (
          <span style={{ pointerEvents: 'none' }}>{item.label}</span>
        )}

        {item.component && (
          <div class="arrow-right">
            <xy-icon name="DownIcon" style={{ transform: 'rotate(-90deg)', pointerEvents: 'none' }} />
            {/* {item.component} */}
          </div>
        )}
      </div>
    )
  }

  private initTippyDropdown() {
    setTimeout(() => {
      console.log(getElement(this.el));

      this.dropdownContent = getElement(this.el).querySelector('.dropdown-content123123')
      console.log(this.itemData, this.dropdownContent, this.itemData?.component)
      if (this.dropdownContent) {
        const { instanceDropdown } = useDropdown({
          contentEl: this.dropdownContent,
          triggerEl: this.dropdownContent,
          customShow: (instance: Instance<Props>) => {
            instance.setProps({
              getReferenceClientRect: () => this.dropEl?.getBoundingClientRect()
            })
          },
          customHide: () => {}
        })
        this.tippyDropdown = instanceDropdown
      }
    }, 0)
  }

  // 保持原有方法声明
  private handleSelect = (item: any, event: MouseEvent) => {
    console.log(item, event)
    this.itemData = item
    this.dropEl = event.target
    console.log(this.itemData)
    console.log(this.tippyDropdown)
    this.initTippyDropdown()
    if(this.tippyDropdown){
      this.tippyDropdown.show()
    }
  }
  private hideComponent = () => {}

  async componentWillLoad() {
    this.initTippyDropdown()
  }
  async componentWillUpdate(){
    this.initTippyDropdown()
  }
  render() {
    const { options } = this.attrs

    return (
      <Host class="xy-select">
        {this.isGrouped(options)
          ? // 分组渲染模式
            options.map((group: any) => (
              <div class="select-group">
                {group[this.groupField] && <div class="group-title">{group[this.groupLabel] || '未命名分组'}</div>}
                <div class="group-items">{group.items.map((item: any) => this.renderItem(item))}</div>
              </div>
            ))
          : // 普通列表模式
            options.map((item: any) => this.renderItem(item))}
        <div class="dropdown-content123123">{this.itemData && this.itemData.component}</div>
      </Host>
    )
  }
}
