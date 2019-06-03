import { TimeData } from '../timeData'
import { BehaviorTreeStatus } from '../behaviorTreeStatus'
import { IBehaviorTreeNode } from '../iBehaviorTreeNode'

export class ActionNode implements IBehaviorTreeNode {
  private name: string
  private fn: (timeData: TimeData) => BehaviorTreeStatus

  constructor(name: string, fn: (timeData: TimeData) => BehaviorTreeStatus) {
    this.name = name
    this.fn = fn
  }

  Tick(time: TimeData) {
    return this.fn(time)
  }
}
