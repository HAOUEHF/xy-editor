import { Component, h, Prop, State, Host } from '@stencil/core'
import * as Icons from '@/icons/index'

@Component({
  tag: 'xy-icon',
  styleUrl: 'xy-icon.scss'
})
export class XyIcon {
  @Prop({ reflect: true }) name?: string // reflect: true 表示将属性值同步到元素的属性上
  @Prop() width?: string | number = 22
  @Prop() height?: string | number = 22

  @State() private iconNode = ''

  /**
   * 在组件即将加载时调用
   * 如果name属性存在，则根据name属性加载图标节点
   */
  componentWillLoad() {
    if (this.name) this.loadIconNode(this.name)
  }
  /**
   * 在组件即将更新时，如果图标的名称发生了变化，则重新加载对应的图标节点。
   */
  componentWillUpdate() {
    if (this.name) this.loadIconNode(this.name)
  }

  private loadIconNode(name: string) {
    const icon = Icons[name as keyof typeof Icons]
    if (icon) this.iconNode = icon
  }
  render() {
    if (!this.iconNode) return null
    return (
      <Host class="xy-icon">
        <img src={this.iconNode} width={this.width} height={this.height} alt="icon" />
      </Host>
    )
  }
}
