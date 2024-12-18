import { Component, h, Prop, State, Host, Element } from '@stencil/core'
import * as Icons from '@/icons/index'
console.log(Icons)

@Component({
  tag: 'xy-icon',
  styleUrl: 'xy-icon.scss'
})
export class XyIcon {
  @Prop({ reflect: true }) name?: string // reflect: true 表示将属性值同步到元素的属性上
  @Prop() width?: string | number = 16
  @Prop() height?: string | number = 16
  @Element() el?: HTMLElement // 获取组件的根元素
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

    // 使用 DOMParser 解析字符串
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(this.iconNode, 'image/svg+xml')
    const svgElement = svgDoc.documentElement // 获取 <svg> 元素
    svgElement.setAttribute('width', this.width as string) // 设置 <svg> 元素的宽度
    svgElement.setAttribute('height', this.height as string) // 设置 <svg> 元素的高度
    this.el?.appendChild(svgElement) // 将 <svg> 元素添加到组件的根元素中
  }
  render() {
    if (!this.iconNode) return null
    return <Host class="xy-icon"></Host>
  }
}
