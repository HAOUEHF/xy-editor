import { Component, h, State, Prop, Element, Watch, Host } from '@stencil/core'
import { computePosition, autoUpdate, offset, flip, shift, arrow, limitShift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'

@Component({
  tag: 'xy-popover',
  styleUrl: 'xy-popover.scss' // 可根据需要定义样式
})
export class MyPopover {
  @Element() el!: HTMLElement

  // 组件可配置的属性
  @Prop() placement: Placement = 'bottom' // 弹出层位置，可选值：top、bottom、left、right 等
  @Prop() modal: boolean = false // 是否为模态弹出层
  @Prop() initialOpen: boolean = false // 初始是否打开
  @Prop() trigger: 'click' | 'hover' = 'click' // 触发方式，可选值：click、hover 等
  // 内部状态
  @State() open: boolean = this.initialOpen // 当前是否打开
  @State() x: number = 0 // 弹出层水平位置
  @State() y: number = 0 // 弹出层垂直位置

  // DOM 引用
  private triggerEl?: HTMLElement // 触发按钮元素
  private floatingEl?: HTMLElement // 弹出层元素
  private arrowEl?: HTMLElement // 箭头元素
  private cleanupAutoUpdate?: () => void // 用于清理 autoUpdate 的函数

  /**
   * 工具方法：将 rem 单位转换为 px 单位
   * @param rem - rem 数值
   * @returns 对应的 px 数值
   */
  remToPx(rem: number): number {
    if (typeof document === 'undefined') {
      return rem * 16
    }

    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  /**
   * 切换弹出层的显示状态
   */
  toggleOpen = () => {
    this.open = !this.open
  }

  handleOnMouseEnter = () => {
    this.open = true
  }

  handleOnMouseLeave = () => {
    this.open = false
  }
  /**
   * 更新弹出层的位置，使用 Floating UI 的 computePosition 计算位置
   */
  updatePosition = () => {
    setTimeout(async () => {
      if (this.triggerEl && this.floatingEl) {
        const { x, y, middlewareData } = await computePosition(this.triggerEl, this.floatingEl, {
          placement: this.placement,
          middleware: [
            // 距离触发器 10/16 rem 的偏移量
            offset(this.remToPx(10 / 16)),
            // 翻转机制
            flip({ fallbackPlacements: ['top', 'right', 'left'], crossAxis: false }),
            // 限制平移
            shift({ limiter: limitShift({ offset: this.remToPx(15 / 16) }) }),
            // 箭头定位
            arrow({ element: this.arrowEl!, padding: 5 })
          ]
        })
        this.x = x
        this.y = y

        // 如果中间件返回了箭头的偏移数据，则更新箭头样式
        const arrowData = middlewareData.arrow
        if (arrowData && this.arrowEl) {
          const { x: arrowX, y: arrowY } = arrowData
          const staticSide: any = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
          }[this.placement.split('-')[0]]
          Object.assign(this.arrowEl.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            [staticSide]: '-4px'
          })
        }
      }
    }, 10)
  }

  /**
   * 监听 open 状态变化，当打开时设置 autoUpdate，关闭时清理
   */
  @Watch('open')
  watchOpen(newValue: boolean) {
    console.log('watchOpen', newValue)

    if (newValue) {
      // 弹出层打开时，开启 autoUpdate 自动更新位置
      if (this.triggerEl && this.floatingEl) {
        this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.floatingEl, this.updatePosition)
      }
      // 立即更新位置
      this.updatePosition()
    } else {
      // 弹出层关闭时，清理 autoUpdate
      if (this.cleanupAutoUpdate) {
        this.cleanupAutoUpdate()
        this.cleanupAutoUpdate = undefined
      }
    }
  }

  /**
   * 点击外部关闭 popover（不包括组件内的触发器及内容区域）
   */
  handleOutsideClick = (event: MouseEvent): void => {
    // 使用 composedPath 兼容 Shadow DOM
    const path = event.composedPath()
    if (!path.includes(this.el)) {
      this.open = false
    }
  }

  /**
   * 组件加载完毕后，如果初始为打开状态，则启动 autoUpdate
   */
  componentDidLoad() {
    if (this.open && this.triggerEl && this.floatingEl) {
      this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.floatingEl, this.updatePosition)
      this.updatePosition()
    }
    // 监听 document 点击事件，捕获阶段处理以便尽早判断
    document.addEventListener('click', this.handleOutsideClick, true)
  }

  /**
   * 组件卸载时，清理 autoUpdate 的回调
   */
  disconnectedCallback() {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate()
    }
    document.removeEventListener('click', this.handleOutsideClick, true)
  }

  render() {
    return (
      <Host class="xy-popover" data-placement={this.placement} data-open={this.open ? 'true' : 'false'}>
        <div
          class="xy-popover-trigger"
          ref={el => (this.triggerEl = el)}
          onClick={this.trigger === 'click' ? this.toggleOpen : undefined}
          onMouseEnter={this.trigger === 'hover' ? this.handleOnMouseEnter : undefined}
          onMouseLeave={this.trigger === 'hover' ? this.handleOnMouseLeave : undefined}
        >
          <slot name="trigger"></slot>
        </div>
        {this.open && (
          <div
            class="xy-popover-wrapper"
            ref={el => (this.floatingEl = el)}
            style={{ left: `${this.x}px`, top: `${this.y}px` }}
          >
            <div class="xy-popover-content">
              <slot></slot>
            </div>
            <div class="xy-popover-arrow" ref={el => (this.arrowEl = el)}></div>
          </div>
        )}
      </Host>
    )
  }
}
