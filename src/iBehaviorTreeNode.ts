import { TimeData } from './timeData'
import { BehaviorTreeStatus } from './behaviorTreeStatus'

export interface IBehaviorTreeNode {
  Tick(timeData: TimeData): BehaviorTreeStatus
}
