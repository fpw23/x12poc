import { X12SegmentHeaderLoopStyle } from '../node-x12/index'
export const H_NM1 = {
  tag: 'NM1',
  layout: {
    NM101: 3,
    NM101_MIN: 2,
    NM102: 1,
    NM102_MIN: 1,
    NM103: 60,
    NM103_MIN: 1,
    NM104: 35,
    NM105: 25,
    NM106: 10,
    NM107: 10,
    NM108: 2,
    NM108_MIN: 1,
    NM109: 80,
    NM109_MIN: 2,
    NM110: 2,
    NM111: 3,
    NM112: 60,
    COUNT: 12,
    PADDING: false
  },
  loopStyle: X12SegmentHeaderLoopStyle.Unbounded,
  loopIdIndex: 1
}
