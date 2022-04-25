import { X12SegmentHeaderLoopStyle } from '../node-x12/index'
export const H_S5 = {
  tag: 'S5',
  layout: {
    S501: 3,
    S501_MIN: 1,
    S502: 2,
    S503: 10,
    S503_MIN: 1,
    S504: 1,
    S505: 10,
    S505_MIN: 1,
    S506: 2,
    S507: 8,
    S507_MIN: 1,
    S508: 1,
    COUNT: 8,
    PADDING: false
  },
  loopStyle: X12SegmentHeaderLoopStyle.Unbounded,
  loopIdIndex: 2
}
