import { BehaviorTreeStatus, TimeData, IBehaviorTreeNode, SequenceNode } from '../../src/index'

let testObject: SequenceNode
beforeEach(() => {
  testObject = new SequenceNode('selector')
})

test('can_run_all_children_in_order', () => {
  const time = new TimeData()
  let callOrder = 0
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      expect(++callOrder).toEqual(1)
      return BehaviorTreeStatus.Success
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      expect(++callOrder).toEqual(2)
      return BehaviorTreeStatus.Success
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  expect(BehaviorTreeStatus.Success).toEqual(testObject.Tick(time))

  expect(2).toEqual(callOrder)
  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
})

test('when first child is running second child is supressed', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)

  expect(BehaviorTreeStatus.Running).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).not.toBeCalled()
})

test('when first child fails then entire sequence fails', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Failure
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)

  expect(BehaviorTreeStatus.Failure).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).not.toBeCalled()
})

test('when second child fails then entire sequence fails', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Failure
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)

  expect(BehaviorTreeStatus.Failure).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
})
