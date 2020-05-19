import { X12SegmentHeaderLoopStyle } from '../node-x12/index'
export const H_EB = {
  tag: 'EB',
  layout: {
    EB01: 3,
    EB01_MIN: 1,
    EB02: 3,
    EB03: 2,
    EB04: 3,
    EB05: 50,
    EB06: 2,
    EB07: 18,
    EB08: 10,
    EB09: 2,
    EB10: 15,
    EB11: 1,
    EB12: 1,
    EB13: 1,
    EB14: 1,
    COUNT: 14,
    PADDING: false
  },
  loopStyle: X12SegmentHeaderLoopStyle.Unbounded,
  loopIdIndex: 1
}
