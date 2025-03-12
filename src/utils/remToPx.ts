/**
 * 工具方法：将 rem 单位转换为 px 单位
 * @param rem - rem 数值
 * @returns 对应的 px 数值
 */
export default function remToPx(value: number): number {
  if (typeof document === 'undefined') {
    return value * 16
  }

  return value * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
