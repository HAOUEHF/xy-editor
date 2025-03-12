import { Placement, StaticSide, ArrowBorderConfig } from '@/types/XYPopover'

export const STATIC_SIDE_MAP: Record<Placement, StaticSide> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
}

export const ARROW_BORDER_CONFIG: Record<Placement, ArrowBorderConfig> = {
  top: { borderLeftColor: 'transparent', borderTopColor: 'transparent' },
  bottom: { borderRightColor: 'transparent', borderBottomColor: 'transparent' },
  left: { borderTopColor: 'transparent', borderLeftColor: 'transparent' },
  right: { borderTopColor: 'transparent', borderRightColor: 'transparent' }
}
