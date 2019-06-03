import { TimeData } from '../timeData'
import { BehaviorTreeStatus } from '../behaviorTreeStatus'
import { IBehaviorTreeNode } from '../iBehaviorTreeNode'
import { LinkedList } from 'typescript-collections'
import { IParentBehaviorTreeNode } from '../iParentBehaviorTreeNode'

/**
 * Sequence node
 *
 * Runs child nodes in sequence, until one fails.
 */
export class SequenceNode implements IParentBehaviorTreeNode {
  /**
   * Name of the node.
   */
  private name: string

  /**
   * List of child nodes.
   */
  private children: LinkedList<IBehaviorTreeNode> = new LinkedList<IBehaviorTreeNode>()

  constructor(name: string) {
    this.name = name
  }

  /**
   * Add a child to the sequence.
   *
   * @param child Child added to sequence.
   */
  AddChild(child: IBehaviorTreeNode) {
    this.children.add(child)
  }

  /**
   * Tick update
   * @param time Delta time since last tick
   * @returns
   */
  Tick(time: TimeData) {
    let childStatus = BehaviorTreeStatus.Success
    this.children.forEach(child => {
      childStatus = child.Tick(time)
      if (childStatus !== BehaviorTreeStatus.Success) {
        return false
      }
    })
    return childStatus
  }
}
