import { TimeData } from '../timeData'
import { BehaviorTreeStatus } from '../behaviorTreeStatus'
import { IBehaviorTreeNode } from '../iBehaviorTreeNode'
import { IParentBehaviorTreeNode } from '../iParentBehaviorTreeNode'
import * as _ from 'lodash'
import { LinkedList } from 'typescript-collections'

export class SelectorNode implements IParentBehaviorTreeNode {
  /**
   * List of child nodes.
   */
  private children: LinkedList<IBehaviorTreeNode> = new LinkedList<IBehaviorTreeNode>()

  constructor(private name: string) {}

  Tick(time: TimeData) {
    let childStatus = BehaviorTreeStatus.Failure
    this.children.forEach(child => {
      childStatus = child.Tick(time)
      if (childStatus !== BehaviorTreeStatus.Failure) {
        return false
      }
    })
    return childStatus
  }

  /**
   * Add a child to the parent node.
   * @param child Child needs to be added.
   */
  AddChild(child: IBehaviorTreeNode) {
    this.children.add(child)
  }
}
