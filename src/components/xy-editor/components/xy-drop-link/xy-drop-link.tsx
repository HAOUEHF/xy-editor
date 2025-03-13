import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core'
import { $t } from '@/i18n'
import type { XYMenuBarItem } from '@/types/XYButtonMenu'
@Component({
  tag: 'xy-drop-link',
  styleUrl: 'xy-drop-link.scss',
})
export class XyDropLink {
  @Element() el!: HTMLElement

  @Prop() attrs:
    | (XYMenuBarItem & {
        href: string
        target: string
        rel: string
      })
    | null = null
  @State() href: string = ''
  @State() target: string = '_blank'
  @State() rel: string = 'noopener noreferrer'
  @State() switchValue: string = 'off'
  private linkInput: HTMLInputElement | null = null
  async componentDidLoad() {
    this.setupSwitch()
  }
  componentWillLoad() {
    if (this.attrs) {
      this.href = this.attrs.href
      this.target = this.attrs.target
      this.rel = this.attrs.rel
    }
  }
  private setupSwitch() {
    console.log('283094829034',this.el);

    if (this.el) {
      const switchBtn = this.el.querySelector('#switch')
      if (switchBtn) {
        switchBtn.addEventListener('click', this.handleSwitchClick)
      }
    }
  }

  private handleSwitchClick = (event: Event) => {
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
    if (this.attrs?.command) {
      this.attrs.command({
        href: this.linkInput.value,
        target: this.switchValue === 'off' ? '_blank' : ''
      })
      this.linkInput.value = ''
      this.switchValue = 'off'
    }
  }

  render() {
    return (
      <Host class="xy-drop-link">
        <div class="drop-content">
          <div class="input-view">
            <xy-icon name="LinkIcon"></xy-icon>
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
