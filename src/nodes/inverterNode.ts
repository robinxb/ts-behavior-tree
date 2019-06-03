import { TimeData } from '../timeData'
import { BehaviorTreeStatus } from '../behaviorTreeStatus'
import { IBehaviorTreeNode } from '../iBehaviorTreeNode'
import { IParentBehaviorTreeNode } from '../iParentBehaviorTreeNode'
import { isUndefined } from 'lodash'
import { ErrInvNodeMustHaveChild, ErrInvNodeMoreThanOneChild } from '../errors'

export class InverterNode implements IParentBehaviorTreeNode {
  private name: string
  private childNode: IBehaviorTreeNode | undefined

  constructor(name: string) {
    this.name = name
  }

  Tick(time: TimeData) {
    if (isUndefined(this.childNode)) {
      throw ErrInvNodeMustHaveChild
    }

    let result = this.childNode.Tick(time)
    if (result === BehaviorTreeStatus.Failure) {
      return BehaviorTreeStatus.Success
    } else if (result === BehaviorTreeStatus.Success) {
      return BehaviorTreeStatus.Failure
    } else {
      return BehaviorTreeStatus.Running
    }
  }

  /**
   * Add a child to the parent node.
   * @param child Child needs to be added.
   */
  AddChild(child: IBehaviorTreeNode) {
    if (!isUndefined(this.childNode)) {
      throw ErrInvNodeMoreThanOneChild
    }

    this.childNode = child
  }
}
