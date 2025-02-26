import { Component, Host, h, State, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'xy-color-picker',
  styleUrl: 'xy-color-picker.scss'
})
export class XyColorPicker {
  @Element() el!: HTMLElement

  @Prop() color: Object | string = {
    r: 255,
    g: 255,
    b: 255,
    a: 255
  }
  @Prop() presetColors: Array<string> = [
    '#ff4500',
    '#ff8c00',
    '#1e90ff',
    '#000000', // 黑色
    '#808080', // 灰色
    '#dedede', // 白色
    '#ffe4e1', // 浅粉色
    '#d3ffce', // 浅绿色
    '#add8e6', // 浅蓝色
    '#f08080', // 浅珊瑚色
    '#e6e6fa', // 浅紫色
    '#fafad2', // 浅金黄色
    '#ffe4b5', // 浅鹿皮色
    '#f0e68c', // 卡其色
    '#e0ffff', // 浅青色
    '#faf0e6', // 亚麻色
    '#ebf7ff',
    '#40507E'
  ]
  @Prop() attrs: any = {}

  @State() saturation: number = 1
  @State() value: number = 1
  @State() hue: number = 0

  @State() red: number = 255
  @State() green: number = 0
  @State() blue: number = 0
  @State() alpha: number = 1

  colorObj() {
    const r = this.red
    const g = this.green
    const b = this.blue
    const a = this.alpha
    const h = this.hue
    const s = this.saturation
    const v = this.value

    return {
      rgb: `rgb(${r},${g},${b})`,
      rgba: `rgba(${r},${g},${b},${a})`,
      hex6: this.rgba2hex(r, g, b),
      hex8: this.rgba2hex(r, g, b, a),
      hsv: `hsv(${h},${s},${v})`,
      hsl: `` // 添加 HSL 转换
    }
  }

  @State() pointStyle: { [key: string]: string } = {
    top: '25%',
    left: '80%'
  }
  @State() hueSliderStyle: { [key: string]: string } = {
    left: '0%'
  }
  @State() alphaSliderStyle: { [key: string]: string } = {
    left: '0%'
  }
  @State() diamondStyle: { [key: string]: string } = {
    backgroundColor: `${this.colorObj().rgba}`,
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25)'
  }
  saturationEl?: HTMLElement
  hueSliderEl?: HTMLElement
  alphaSliderEl?: HTMLElement

  @Event()
  colorChange!: EventEmitter<{
    r: number
    g: number
    b: number
    a: number
  }>

  @Watch('red')
  @Watch('green')
  @Watch('blue')
  onChangeRGB() {
    this.colorChange.emit({
      r: this.red,
      g: this.green,
      b: this.blue,
      a: this.alpha
    })

    this.diamondStyle.backgroundColor = this.colorObj().rgba

    let { h, s, v } = this.rgb2hsv(this.red, this.green, this.blue)

    this.hue = h
    this.saturation = s
    this.value = v

    this.pointStyle.top = `${100 - v * 100}%`
    this.pointStyle.left = `${s * 100}%`

    this.hueSliderStyle.left = `${(this.hue / 360) * 100}%;`
  }

  @Watch('alpha')
  onChangeAlpha() {
    this.colorChange.emit({
      r: this.red,
      g: this.green,
      b: this.blue,
      a: this.alpha
    })
    this.diamondStyle.backgroundColor = this.colorObj().rgba
    this.alphaSliderStyle.left = `${this.alpha >= 1 ? 'calc(100% - 6px)' : this.alpha * 100 + '%'};`
  }

  mousedownSV = (e: MouseEvent) => {
    e.stopPropagation()
    // 鼠标按下计算饱和度和亮度并添加事件
    this.handleChangeSV(e)
    // 添加整个页面的鼠标事件
    window.addEventListener('mousemove', this.handleChangeSV)
    window.addEventListener('mouseup', this.mouseupSV)
  }

  mouseupSV = () => {
    // 鼠标松开后移除事件
    window.removeEventListener('mousemove', this.handleChangeSV)
    window.removeEventListener('mouseup', this.mouseupSV)
  }

  mousedownHue = (e: MouseEvent) => {
    e.stopPropagation()
    this.handleChangeHue(e)
    window.addEventListener('mousemove', this.handleChangeHue)
    window.addEventListener('mouseup', this.mouseupHue)
  }

  mouseupHue = () => {
    window.removeEventListener('mousemove', this.handleChangeHue)
    window.removeEventListener('mouseup', this.mouseupHue)
  }

  mousedownAlpha = (e: MouseEvent) => {
    e.stopPropagation()
    this.handleChangeAlpha(e)
    window.addEventListener('mousemove', this.handleChangeAlpha)
    window.addEventListener('mouseup', this.mouseupAlpha)
  }

  mouseupAlpha = () => {
    window.removeEventListener('mousemove', this.handleChangeAlpha)
    window.removeEventListener('mouseup', this.mouseupAlpha)
  }

  handleChangeSV = (e: MouseEvent) => {
    if (!this.saturationEl) return
    let w = this.saturationEl.clientWidth
    let h = this.saturationEl.clientHeight
    let x = e.pageX - this.saturationEl.getBoundingClientRect().left
    let y = e.pageY - this.saturationEl.getBoundingClientRect().top
    x = x < w && x > 0 ? x : x > w ? w : 0
    y = y < h && y > 0 ? y : y > h ? h : 0
    // 计算饱和度和亮度
    this.saturation = Math.floor((x / w) * 100 + 0.5) / 100
    this.value = Math.floor((1 - y / h) * 100 + 0.5) / 100
    // hsv转化为rgb
    let { r, g, b } = this.hsv2rgb(this.hue, this.saturation, this.value)
    this.red = r
    this.green = g
    this.blue = b
    // 移动背景板圆圈
    this.pointStyle = {
      top: `${y}px`,
      left: `${x}px`
    }
    this.handleCommand()
  }

  handleChangeHue = (e: MouseEvent) => {
    if (!this.hueSliderEl || !this.saturationEl) return
    let w = this.hueSliderEl.clientWidth
    let x = e.pageX - this.saturationEl.getBoundingClientRect().left
    x = x < w && x > 0 ? x : x > w ? w : 0
    // 计算色调
    this.hue = Math.floor((x / w) * 360 + 0.5)
    // hsv转化为rgb
    let { r, g, b } = this.hsv2rgb(this.hue, this.saturation, this.value)

    this.red = r
    this.green = g
    this.blue = b
    // 移动滑块
    this.hueSliderStyle = { left: ` ${x >= w - 6 ? w - 6 : x}px` }
    this.handleCommand()
  }

  handleChangeAlpha = (e: MouseEvent) => {
    if (!this.alphaSliderEl || !this.saturationEl) return

    let w = this.alphaSliderEl.clientWidth
    let x = e.pageX - this.saturationEl.getBoundingClientRect().left
    x = x < w && x > 0 ? x : x > w ? w : 0
    // 计算透明度
    this.alpha = Math.floor((x / w) * 100 + 0.5) / 100
    // 移动滑块
    this.alphaSliderStyle = { left: ` ${x >= w - 6 ? w - 6 : x}px` }
    this.handleCommand()
  }

  hexChange = (e: Event) => {
    let v = (e.target as HTMLInputElement).value
    if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) {
      let { r, g, b, a } = this.hex2rgba(v)
      this.red = r
      this.green = g
      this.blue = b
      this.alpha = a
    }
  }

  redChange(e: Event) {
    let v = (e.target as HTMLInputElement).value as unknown as number
    if (v !== undefined) {
      v > 255 && (this.red = 255)
      v < 0 && (this.red = 0)
      v >= 0 && v <= 255 && (this.red = parseInt(v as unknown as string))
    }
    this.handleCommand()
  }

  greenChange = (e: Event) => {
    let v = (e.target as HTMLInputElement).value as unknown as number
    if (v !== undefined) {
      v > 255 && (this.green = 255)
      v < 0 && (this.green = 0)
      v >= 0 && v <= 255 && (this.green = parseInt(v as unknown as string))
    }
    this.handleCommand()
  }

  blueChange = (e: Event) => {
    let v = (e.target as HTMLInputElement).value as unknown as number
    if (v !== undefined) {
      v > 255 && (this.blue = 255)
      v < 0 && (this.blue = 0)
      v >= 0 && v <= 255 && (this.blue = parseInt(v as unknown as string))
    }
    this.handleCommand()
  }

  alphaChange = (e: Event) => {
    let v = (e.target as HTMLInputElement).value as unknown as number
    if (v !== undefined) {
      v = parseFloat(v as unknown as string)
      this.alpha = v
      v > 1 && (this.alpha = 1)
      v < 0 && (this.alpha = 0)
      v >= 0 && v <= 1 && (this.alpha = v)
    }
    this.handleCommand()
  }

  presetChange = (item: any) => {
    if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(item)) {
      console.log(item)

      let { r, g, b, a } = this.hex2rgba(item)
      this.red = r
      this.green = g
      this.blue = b
      this.alpha = a
    }
    this.handleCommand()
  }

  hsv2rgb = (h: number, s: number, v: number) => {
    h === 360 && (h = 0)
    let i = Math.floor(h / 60) % 6
    let f = h / 60 - i
    let p = v * (1 - s)
    let q = v * (1 - s * f)
    let t = v * (1 - s * (1 - f))
    let [r, g, b] = [1, 1, 1]
    if (i === 0) {
      r = v
      g = t
      b = p
    } else if (i === 1) {
      r = q
      g = v
      b = p
    } else if (i === 2) {
      r = p
      g = v
      b = t
    } else if (i === 3) {
      r = p
      g = q
      b = v
    } else if (i === 4) {
      r = t
      g = p
      b = v
    } else if (i === 5) {
      r = v
      g = p
      b = q
    }
    r = Math.floor(r * 255 + 0.5)
    g = Math.floor(g * 255 + 0.5)
    b = Math.floor(b * 255 + 0.5)
    return { r, g, b }
  }

  hex2rgba = (s: string): any => {
    if (/^#?[0-9a-fA-F]{3}$/.test(s)) {
      let b = s.substring(s.length - 1, s.length)
      let g = s.substring(s.length - 2, s.length - 1)
      let r = s.substring(s.length - 3, s.length - 2)
      return this.hex2rgba(`${r + r}${g + g}${b + b}`)
    }
    if (/^#?[0-9a-fA-F]{4}$/.test(s)) {
      let a = s.substring(s.length - 1, s.length)
      let b = s.substring(s.length - 2, s.length - 1)
      let g = s.substring(s.length - 3, s.length - 2)
      let r = s.substring(s.length - 4, s.length - 3)
      return this.hex2rgba(`${r + r}${g + g}${b + b}${a + a}`)
    }
    if (/^#?[0-9a-fA-F]{6}$/.test(s)) {
      let b = parseInt('0x' + s.substring(s.length - 2, s.length))
      let g = parseInt('0x' + s.substring(s.length - 4, s.length - 2))
      let r = parseInt('0x' + s.substring(s.length - 6, s.length - 4))
      return { r, g, b, a: 1 }
    }
    if (/^#?[0-9a-fA-F]{8}$/.test(s)) {
      let a = parseInt('0x' + s.substring(s.length - 2, s.length))
      a = a / 255
      let b = parseInt('0x' + s.substring(s.length - 4, s.length - 2))
      let g = parseInt('0x' + s.substring(s.length - 6, s.length - 4))
      let r = parseInt('0x' + s.substring(s.length - 8, s.length - 6))
      return { r, g, b, a }
    }
  }

  parseColor = (color: any) => {
    if (color) {
      let r, g, b, a
      if (typeof color === 'string') {
        if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3}|[0-9a-fA-F]{4})$/.test(color)) {
          return this.hex2rgba(color)
        }
      } else {
        r = color.r > 255 ? 255 : color.r < 0 ? 0 : color.r
        g = color.g > 255 ? 255 : color.g < 0 ? 0 : color.g
        b = color.b > 255 ? 255 : color.b < 0 ? 0 : color.b
        a = color.a > 1 ? 1 : color.a < 0 ? 0 : color.a
        return { r, g, b, a }
      }
    } else {
      return null
    }
  }

  rgba2hex(r: any, g: any, b: any, a: any = 1) {
    r = parseInt(r)
    let r1 = r.toString(16).length !== 2 ? '0' + r.toString(16) : r.toString(16)
    g = parseInt(g)
    let g1 = g.toString(16).length !== 2 ? '0' + g.toString(16) : g.toString(16)
    b = parseInt(b)
    let b1 = b.toString(16).length !== 2 ? '0' + b.toString(16) : b.toString(16)
    a = parseFloat(a)
    let a1 = ''
    if (a !== 1) {
      let temp = Math.floor(256 * a)
      a1 = temp.toString(16).length !== 2 ? '0' + temp.toString(16) : temp.toString(16)
    }
    return `#${r1}${g1}${b1}${a1}`.toUpperCase()
  }

  rgb2hsv = (r: any, g: any, b: any) => {
    let r1 = r / 255
    let g1 = g / 255
    let b1 = b / 255
    let cmax = Math.max(r1, g1, b1)
    let cmin = Math.min(r1, g1, b1)
    let d = cmax - cmin
    let h = 0,
      s,
      v
    if (d === 0) {
      h = 0
    } else if (cmax === r1) {
      h = ((60 * (g1 - b1)) / d + 360) % 360
    } else if (cmax === g1) {
      h = 60 * ((b1 - r1) / d + 2)
    } else if (cmax === b1) {
      h = 60 * ((r1 - g1) / d + 4)
    }
    if (cmax === 0) {
      s = 0
    } else {
      s = d / cmax
    }
    v = cmax
    h = Math.floor(h + 0.5)
    s = Math.floor(s * 100 + 0.5) / 100
    v = Math.floor(v * 100 + 0.5) / 100
    return { h, s, v }
  }

  handleCommand = () => {
    const { command } = this.attrs
    if (command) {
      command(this.colorObj().rgba)
    }
  }

  handleUnsetCommand = () => {
    const { unsetCommand } = this.attrs
    if (unsetCommand) {
      unsetCommand()
    }
  }

  componentWillLoad() {
    let { r, g, b, a } = this.parseColor(this.color)
    this.red = r
    this.green = g
    this.blue = b
    this.alpha = a
  }
  render() {
    return (
      <Host class="xy-color-picker">
        <div class="saturation-value" ref={el => (this.saturationEl = el)} onMouseDown={this.mousedownSV}>
          <div style={{ backgroundColor: `hsl(${this.hue}, 100%, 50%)` }}>
            <div class="point" style={{ ...this.pointStyle }}></div>
          </div>
          <div class="saturation-value-2"></div>
          <div class="saturation-value-3"></div>
        </div>
        <div class="color-select-middle">
          <div style={{ flex: 'auto' }}>
            <div class="hue-slider" ref={el => (this.hueSliderEl = el)} onMouseDown={this.mousedownHue.bind(this)}>
              <div class="slider" style={{ ...this.hueSliderStyle }}></div>
            </div>
            <div
              class="alpha-slider"
              ref={el => (this.alphaSliderEl = el)}
              onMouseDown={this.mousedownAlpha.bind(this)}
            >
              <div class="slider" style={{ ...this.alphaSliderStyle }}></div>
              <div
                style={{
                  backgroundColor: `linear-gradient(to right, rgba(0,0,0,0), ${this.colorObj().rgb});width: 100%;height: 100%`
                }}
              ></div>
            </div>
          </div>
          <div class="color-diamond">
            <div style={{ ...this.diamondStyle }}></div>
          </div>
        </div>
        <div class="color-value">
          <div class="hex">
            <label>
              <input
                id="hex8"
                value={this.colorObj().hex8}
                spellcheck="false"
                aria-label="Hex color code"
                onInput={this.hexChange}
              />
            </label>
            <p>Hex</p>
          </div>
          <div class="rgba-r">
            <label>
              <input value={this.red} aria-label="Red color code" onInput={this.redChange} />
            </label>
            <p>R</p>
          </div>
          <div class="rgba-g">
            <label>
              <input value={this.green} aria-label="Green color code" onInput={this.greenChange} />
            </label>
            <p>G</p>
          </div>
          <div class="rgba-b">
            <label>
              <input value={this.blue} aria-label="Blue color code" onInput={this.blueChange} />
            </label>
            <p>B</p>
          </div>
          <div class="rgba-a">
            <label>
              <input value={this.alpha} aria-label="Alpha color code" onInput={this.alphaChange} />
            </label>
            <p>A</p>
          </div>
        </div>
        <div class="preset">
          {this.presetColors.map(color => {
            return (
              <div class="color-preset" onClick={() => this.presetChange(color)}>
                <div style={{ backgroundColor: color }}></div>
              </div>
            )
          })}
          <div class="back-icon" onClick={this.handleUnsetCommand}>
            <xy-icon name="BackOneIcon" width="26" height="26"></xy-icon>
          </div>
        </div>
      </Host>
    )
  }
}
