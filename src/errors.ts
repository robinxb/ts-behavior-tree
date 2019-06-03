export const ErrUnnestedTree = new Error(
  "Can't create an unnested ActionNode, it must be a leaf node."
)
export const ErrZeroNodes = new Error("Can't create a behavior tree with zero nodes")
export const ErrInvNodeMustHaveChild = new Error(`InverterNode must have a child node!`)
export const ErrInvNodeMoreThanOneChild = new Error(
  "Can't add more than a single child to InverterNode!"
)
export const ErrorSpliceUnnested = new Error(
  'Cannot splice an unnested sub-tree, there must be a parent-tree.'
)
