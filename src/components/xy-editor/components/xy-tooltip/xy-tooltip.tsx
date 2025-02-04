import { Component, Host, h, Prop, Element, Method, Listen, State } from '@stencil/core'
import { computePosition, shift, offset, arrow, flip } from '@floating-ui/dom'
import type { XYTooltipTrigger } from '@/types/XYTooltip'
import type { Placement } from '@floating-ui/dom'

@Component({
  tag: 'xy-tooltip',
  styleUrl: 'xy-tooltip.scss',
  shadow: true
})
export class XyTooltip {
  @Element() el!: HTMLElement
  @Prop() content?: string
  @Prop() placement: Placement = 'top'
  @Prop() trigger: XYTooltipTrigger = 'hover'

  @State() isOpen = false
  componentDidLoad() {
    // this.initTooltip()
  }

  @Method()
  initTooltip() {
    const button = this.el.shadowRoot?.querySelector('slot') as HTMLSlotElement
    // console.log(button)
    console.log(this.el.shadowRoot?.querySelectorAll('slot')[0].assignedElements({ flatten: true }))
    console.log(this.el.shadowRoot?.querySelectorAll('slot')[0].assignedNodes({ flatten: true }))
    console.log(this.el.shadowRoot?.querySelectorAll('slot')[0].assignedSlot)

    // assignedSlot：它是标签的一个属性，通常在slot的目标标签使用，用于获取目标标签绑定的slot标签
    // assignedNodes：assignedNodes是slot上的函数，使用该方法可以返回所有分配的节点，包括文本节点和元素节点
    // assignedElements：assignedElements是slot上的函数，它会返回分配的元素节点
    const tooltip = this.el.shadowRoot?.querySelector('#xy-tooltip-content') as HTMLElement
    const arrowElement = this.el.shadowRoot?.querySelector('#xy-tooltip-arrow') as HTMLElement
    console.log(button, tooltip)

    if (!button || !tooltip) return
    computePosition(button.assignedElements()[0], tooltip, {
      placement: this.placement,
      middleware: [shift({ padding: 10 }), flip(), offset(6), arrow({ element: arrowElement })]
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`
      })
      const { x: arrowX, y: arrowY } = middlewareData.arrow!
      const staticSide: any = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]]
      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
        display: 'block'
      })
    })
  }

  @Listen('mouseenter')
  handleMouseEnter() {
    this.isOpen = true
    setTimeout(() => {
      const el = this.el.shadowRoot?.querySelector('#xy-tooltip-content') as HTMLElement
      el.style.display = 'block'
      el.style.opacity = '1'
      this.initTooltip()
    }, 10)
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    const el = this.el.shadowRoot?.querySelector('#xy-tooltip-content') as HTMLElement
    el.style.display = 'none'
    el.style.opacity = '0'
    this.isOpen = false
  }

  render() {
    return (
      <Host class="xy-tooltip">
        <slot></slot>
        {this.isOpen ? (
          <div id="xy-tooltip-content">
            <div id="xy-tooltip-arrow"></div>
            {this.content ? this.content : <slot name="content"></slot>}
          </div>
        ) : null}
      </Host>
    )
  }
}
