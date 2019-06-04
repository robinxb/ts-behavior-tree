import Stack from 'typescript-collections/dist/lib/Stack'
import { TimeData } from './timeData'
import { BehaviorTreeStatus } from './behaviorTreeStatus'
import { IBehaviorTreeNode } from './iBehaviorTreeNode'
import { ActionNode } from './nodes/actionNode'
import { IParentBehaviorTreeNode } from './iParentBehaviorTreeNode'
import { ParallelNode } from './nodes/parallelNode'
import { InverterNode } from './nodes/inverterNode'
import { SelectorNode } from './nodes/selectorNode'
import isUndefined from 'lodash.isundefined'
import { SequenceNode } from './nodes/sequenceNode'
import { ErrUnnestedTree, ErrZeroNodes, ErrorSpliceUnnested } from './errors'

/**
 * The builder of behavior tree
 *
 * Use [[End]] to complete build.
 *
 * Use [[Build]]  to get an instance of root node.
 *
 * Basic usage example:
 *
 * ```ts
 * import {behaviorTreeBuilder} from 'ts-behavior-tree';
 * let root = new behaviorTreeBuilder()
 *      .Do('something', t => {
 *          console.log(`Time updated: ${t}`);
 *      }
 * ).end().build();
 * ```
 */
export class BehaviorTreeBuilder {
  curNode: IBehaviorTreeNode | undefined = undefined
  parentNodeStack: Stack<IParentBehaviorTreeNode> = new Stack<IParentBehaviorTreeNode>()

  /**
   * Create an action node.
   * @param name name of action node.
   * @param fn Things need to be executed.
   * @returns Builder itself.
   */
  Do(name: string, fn: (timeData: TimeData) => BehaviorTreeStatus): BehaviorTreeBuilder {
    if (this.parentNodeStack.isEmpty()) {
      throw ErrUnnestedTree
    }
    let actionNode = new ActionNode(name, fn)
    this.parentNodeStack.peek()!.AddChild(actionNode)
    return this
  }

  /**
   * Like an action node, but the function can return true/false and is mapped to success/failure.
   * @param name name of this node.
   * @param fn Things need to be executed.
   * @returns Builder itself.
   */
  Condition(name: string, fn: (timeData: TimeData) => boolean): BehaviorTreeBuilder {
    return this.Do(name, t => (fn(t) ? BehaviorTreeStatus.Success : BehaviorTreeStatus.Failure))
  }

  /**
   * Create an inverter node that inverts the success/failure of its children.
   * @param name name of this node.
   * @returns Builder itself.
   */
  Inverter(name: string): BehaviorTreeBuilder {
    let inverterNode = new InverterNode(name)
    if (!this.parentNodeStack.isEmpty()) {
      this.parentNodeStack.peek()!.AddChild(inverterNode)
    }
    this.parentNodeStack.push(inverterNode)
    return this
  }

  /**
   * Create a sequence node.
   * @param name
   * @returns Builder itself.
   */
  Sequence(name: string): BehaviorTreeBuilder {
    let sequenceNode = new SequenceNode(name)
    if (!this.parentNodeStack.isEmpty()) {
      this.parentNodeStack.peek()!.AddChild(sequenceNode)
    }
    this.parentNodeStack.push(sequenceNode)
    return this
  }

  /**
   * Create a parallel node.
   * @param name name of this node.
   * @param numRequiredToFail If number of failures reaches this, then this node will return [[behaviorTreeStatus.Failure]]
   * @param numRequiredToSucceed If number of success reaches this, then this node will return [[behaviorTreeStatus.Success]]
   * @returns Builder itself.
   */
  Parallel(
    name: string,
    numRequiredToFail: number,
    numRequiredToSucceed: number
  ): BehaviorTreeBuilder {
    let parallelNode = new ParallelNode(name, numRequiredToFail, numRequiredToSucceed)
    if (!this.parentNodeStack.isEmpty()) {
      this.parentNodeStack.peek()!.AddChild(parallelNode)
    }
    this.parentNodeStack.push(parallelNode)
    return this
  }

  /**
   * Create a selector node.
   * @param name name of this node.
   * @returns Builder itself.
   */
  Selector(name: string): BehaviorTreeBuilder {
    let selectorNode = new SelectorNode(name)
    if (!this.parentNodeStack.isEmpty()) {
      this.parentNodeStack.peek()!.AddChild(selectorNode)
    }
    this.parentNodeStack.push(selectorNode)
    return this
  }

  /**
   * Splice a sub tree into the parent tree.
   * @param subTree sub tree that need to be added.
   * @returns Builder itself.
   */
  Splice(subTree: IBehaviorTreeNode): BehaviorTreeBuilder {
    if (this.parentNodeStack.isEmpty()) {
      throw ErrorSpliceUnnested
    }

    this.parentNodeStack.peek()!.AddChild(subTree)
    return this
  }

  /**
   * Build the actual tree.
   * @returns Root node of this tree.
   */
  Build(): IBehaviorTreeNode {
    if (isUndefined(this.curNode)) {
      throw ErrZeroNodes
    }
    return this.curNode
  }

  /**
   * Ends a sequence of children.
   * @returns Builder itself.
   */
  End(): BehaviorTreeBuilder {
    this.curNode = this.parentNodeStack.pop()
    return this
  }
}
