import { BehaviorTreeStatus, TimeData, SelectorNode, IBehaviorTreeNode } from '../../src/index'

let testObject: SelectorNode
beforeEach(() => {
  testObject = new SelectorNode('selector')
})

test('runs the first node if it succeeds', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  expect(BehaviorTreeStatus.Success).toEqual(testObject.Tick(time))
  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).not.toBeCalled()
})

test('stops on the first node when it is running', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Failure
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  expect(BehaviorTreeStatus.Running).toEqual(testObject.Tick(time))
  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).not.toBeCalled()
})

test('runs the second node if the first fails', () => {
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
  expect(BehaviorTreeStatus.Success).toEqual(testObject.Tick(time))
  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
})

test('fails when all children fail', () => {
  const time = new TimeData()
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Failure
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
