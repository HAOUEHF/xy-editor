import { Component, Element, Host, h, Prop, State, Fragment, getElement, EventEmitter, Event } from '@stencil/core'

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
  private itemData: any = null

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
          </div>
        )}
      </div>
    )
  }

  @Event() command!: EventEmitter<any>
  // 保持原有方法声明
  private handleSelect = (item: any, event: MouseEvent) => {
    this.itemData = item
    console.log(this.attrs);
    if(this.attrs.command){
      this.attrs.command(item.value)
      this.command.emit(item.value)
    }
  }
  private hideComponent = () => {}

  async componentWillLoad() {
  }
  async componentWillUpdate(){
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
        <div class="dropdown-content">{this.itemData && this.itemData.component}</div>
      </Host>
    )
  }
}
