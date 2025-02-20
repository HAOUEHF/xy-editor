import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core'
import { $t } from '@/i18n'

@Component({
  tag: 'xy-drop-link',
  styleUrl: 'xy-drop-link.scss',
  shadow: true
})
export class XyDropLink {
  @Element() el!: HTMLElement

  // Props 需要根据实际业务定义
  @Prop() href: string = ''
  @Prop() target: string = '_blank'
  @Prop() command?: (params: { href: string; target: string }) => void
  @Prop() attrs: any = {}
  @State() switchValue: string = 'off'
  private linkInput: HTMLInputElement | null = null
  componentDidLoad() {
    this.setupSwitch()
    console.log(this)
  }

  private setupSwitch() {
    console.log(this.el?.shadowRoot?.querySelector('#switch'))

    if (this.el.shadowRoot) {
      const switchBtn = this.el.shadowRoot.querySelector('#switch')
      console.log(switchBtn)

      if (switchBtn) {
        switchBtn.addEventListener('click', this.handleSwitchClick)
      }
    }
  }

  private handleSwitchClick = (event: Event) => {
    console.log(event)

    const el = event.currentTarget as HTMLButtonElement
    const isChecked = el.getAttribute('aria-checked') === 'true'
    el.setAttribute('aria-checked', (!isChecked).toString())
    this.switchValue = isChecked ? 'off' : 'no'
  }

  @Watch('href')
  @Watch('target')
  handlePropsChange() {
    if (this.href) {
      this.switchValue = this.target === '_blank' ? 'off' : 'no'
      if (this.linkInput) this.linkInput.value = this.href
    }
  }

  private handleConfirm = () => {
    console.log(this.linkInput?.value)

    if (!this.linkInput?.value) return
    if (this.attrs.command) {
      this.attrs.command({
        href: this.linkInput.value,
        target: this.switchValue === 'off' ? '_blank' : ''
      })
    }
  }

  render() {
    return (
      <Host class="xy-drop-link">
        <div class="drop-content">
          <div class="input-view">
            <link-icon></link-icon>
            <input
              id="linkEl"
              type="text"
              placeholder={$t('dropLink.placeholder')}
              ref={el => (this.linkInput = el!)}
            />
          </div>
          <div class="confirm" onClick={this.handleConfirm}>
            {$t('dropLink.confirm')}
          </div>
        </div>
        <div class="drop-switch">
          <label class="switch" htmlFor="switch">
            {$t('dropLink.switchTip')}
          </label>
          <button type="button" role="switch" class="switch" id="switch" aria-checked="false" value="off">
            <div class="switch-btn"></div>
          </button>
        </div>
      </Host>
    )
  }
}
