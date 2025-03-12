import { Component, Prop, State, Host, h, Element, Watch, Method, getElement } from '@stencil/core'
import { computePosition, autoUpdate, offset, flip, shift, arrow, limitShift } from '@floating-ui/dom'
import { remToPx } from '@/utils'
import { STATIC_SIDE_MAP, ARROW_BORDER_CONFIG } from '@/constants'
import type { Placement } from '@floating-ui/dom'
import type { StaticSide } from '@/types/XYPopover'
@Component({
  tag: 'xy-dropdown',
  styleUrl: 'xy-dropdown.scss'
})
export class XyDropdown {
  @Element() el!: HTMLElement

  // 组件可配置的属性
  @Prop() placement: Placement = 'bottom' // 弹出层位置，可选值：top、bottom、left、right 等
  @Prop() trigger: 'click' | 'hover' = 'click' // 触发方式，可选值：click、hover 等

  @State() open: boolean = false
  @State() x: number = 0 // 弹出层水平位置
  @State() y: number = 0 // 弹出层垂直位置
  @State() isHovering: boolean = false // 是否处于悬停状态
  private triggerEl?: HTMLElement
  private floatingEl?: HTMLElement // 弹出层元素
  private arrowEl?: HTMLElement // 箭头元素
  private cleanupAutoUpdate?: () => void // 用于清理 autoUpdate 的函数

  @Method()
  async toggleOpen() {
    this.open = !this.open
  }

  handleOnMouseEnter = () => {
    this.isHovering = true
    if (this.trigger === 'hover') {
      this.open = true
    }
  }

  handleOnMouseLeave = () => {
    this.isHovering = false
    if (this.trigger === 'hover') {
      // 延迟 200ms 关闭避免闪动
      setTimeout(() => {
        if (!this.isHovering) this.open = false
      }, 200)
    }
  }

  updatePosition = () => {
    setTimeout(async () => {
      if (this.triggerEl && this.floatingEl) {
        const { x, y, middlewareData } = await computePosition(this.triggerEl, this.floatingEl, {
          placement: this.placement,
          middleware: [
            // 距离触发器 10/16 rem 的偏移量
            offset(remToPx(10 / 16)),
            // 翻转机制
            flip({ fallbackPlacements: ['top', 'right', 'left'], crossAxis: false }),
            // 限制平移
            shift({ limiter: limitShift({ offset: remToPx(15 / 16) }) }),
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
          const placement = (middlewareData.offset?.placement ?? this.placement) as StaticSide
          const mainPlacement = placement.split('-')[0] as StaticSide
          console.log('mainPlacement', mainPlacement)
          if (!Object.keys(STATIC_SIDE_MAP).includes(mainPlacement)) {
            console.error('Invalid placement:', mainPlacement)
            return
          }

          const staticSide = STATIC_SIDE_MAP[mainPlacement]
          const arrowStyles = {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            [staticSide]: '-4px',
            ...ARROW_BORDER_CONFIG[mainPlacement]
          }

          Object.assign(this.arrowEl.style, arrowStyles)

          getElement(this).setAttribute('data-placement', mainPlacement)
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
      <Host class="xy-dropdown" data-placement={this.placement} data-open={this.open ? 'true' : 'false'}>
        <div
          class="xy-dropdown-trigger"
          ref={el => (this.triggerEl = el)}
          onClick={this.trigger === 'click' ? () => this.toggleOpen() : undefined}
          onMouseEnter={this.handleOnMouseEnter}
          onMouseLeave={this.handleOnMouseLeave}
        >
          <slot></slot>
        </div>
        {this.open && (
          <div
            class="xy-dropdown-wrapper"
            ref={el => (this.floatingEl = el)}
            style={{ left: `${this.x}px`, top: `${this.y}px` }}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
          >
            <div class="xy-dropdown-content">
              <slot name="dropdown"></slot>
            </div>
            <div class="xy-dropdown-arrow" ref={el => (this.arrowEl = el)}></div>
          </div>
        )}
      </Host>
    )
  }
}
