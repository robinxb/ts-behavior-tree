import { IParentBehaviorTreeNode } from '../iParentBehaviorTreeNode'
import LinkedList from 'typescript-collections/dist/lib/LinkedList'
import { IBehaviorTreeNode } from '../iBehaviorTreeNode'
import { TimeData } from '../timeData'
import { BehaviorTreeStatus } from '../behaviorTreeStatus'

/**
 * Sequence node
 *
 * Runs child nodes in sequence, until one fails.
 */
export class ParallelNode implements IParentBehaviorTreeNode {
  private name: string
  private children: LinkedList<IBehaviorTreeNode> = new LinkedList<IBehaviorTreeNode>()
  private numRequiredToFail: number
  private numRequiredToSucceed: number

  constructor(name: string, numRequiredToFail: number, numRequiredToSucceed: number) {
    this.name = name
    this.numRequiredToFail = numRequiredToFail
    this.numRequiredToSucceed = numRequiredToSucceed
  }

  Tick(time: TimeData) {
    let numChildrenSuceeded = 0
    let numChildrenFailed = 0

    this.children.forEach(child => {
      let childStatus = child.Tick(time)
      switch (childStatus) {
        case BehaviorTreeStatus.Success:
          ++numChildrenSuceeded
          break
        case BehaviorTreeStatus.Failure:
          ++numChildrenFailed
          break
      }
    })

    if (numChildrenSuceeded > 0 && numChildrenSuceeded >= this.numRequiredToSucceed) {
      return BehaviorTreeStatus.Success
    }

    if (numChildrenFailed > 0 && numChildrenFailed >= this.numRequiredToFail) {
      return BehaviorTreeStatus.Failure
    }
    return BehaviorTreeStatus.Running
  }

  AddChild(child: IBehaviorTreeNode) {
    this.children.add(child)
  }
}
