import { Component, Host, h, State, Prop, Element } from '@stencil/core'

@Component({
  tag: 'xy-color-picker',
  styleUrl: 'xy-color-picker.scss'
})
export class XyColorPicker {
  @Element() el!: HTMLElement
  @State() hue: number = 0

  @State() colorObj: any = {
    rgb: 'rgb(255, 0, 0)',
    hsl: 'hsl(0, 100%, 50%)',
    hex: '#ff0000'
  }
  private saturationEl?: HTMLElement
  private hueSliderEl?: HTMLElement
  private alphaSliderEl?: HTMLElement
  componentDidLoad() {
    console.log(this.saturationEl)
  }
  render() {
    return (
      <Host class="xy-color-picker">
        <div class="saturation-value" ref={el => (this.saturationEl = el)}>
          <div style={{ backgroundColor: `hsl(${this.hue}, 100%, 50%)` }}>
            <div class="point"></div>
          </div>
          <div class="saturation-value-2"></div>
          <div class="saturation-value-3"></div>
        </div>
        <div class="color-select-middle">
          <div style={{ flex: 'auto' }}>
            <div class="hue-slider" ref={el => (this.hueSliderEl = el)}>
              <div class="slider"></div>
            </div>
            <div class="alpha-slider" ref={el => (this.alphaSliderEl = el)}>
              <div class="slider"></div>
              <div
                style={{
                  backgroundColor: `linear-gradient(to right, rgba(0,0,0,0), ${this.colorObj.rgb});width: 100%;height: 100%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </Host>
    )
  }
}
