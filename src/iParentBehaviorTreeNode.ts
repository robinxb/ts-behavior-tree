import { IBehaviorTreeNode } from './iBehaviorTreeNode'

export interface IParentBehaviorTreeNode extends IBehaviorTreeNode {
  AddChild(child: IBehaviorTreeNode): void
}
