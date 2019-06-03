import { BehaviorTreeStatus, TimeData, ParallelNode, IBehaviorTreeNode } from '../../src/index'

let testObject: ParallelNode

beforeEach(() => {
  testObject = new ParallelNode('p', 2, 2)
})

test('runs all nodes in order', () => {
  const time = new TimeData()
  let callOrder = 0
  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      expect(1).toEqual(++callOrder)
      return BehaviorTreeStatus.Running
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      expect(2).toEqual(++callOrder)
      return BehaviorTreeStatus.Running
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  expect(BehaviorTreeStatus.Running).toEqual(testObject.Tick(time))
  expect(2).toEqual(callOrder)
  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
})

test('fails when required number of children fail', () => {
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
  const mockChild3 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  testObject.AddChild(mockChild3)

  expect(BehaviorTreeStatus.Failure).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
  expect(mockChild3.Tick).toBeCalledTimes(1)
})

test('succeeds when required number of children succeed', () => {
  const time = new TimeData()

  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  const mockChild3 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  testObject.AddChild(mockChild1)
  testObject.AddChild(mockChild2)
  testObject.AddChild(mockChild3)

  expect(BehaviorTreeStatus.Success).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
  expect(mockChild3.Tick).toBeCalledTimes(1)
})

test('continues to run if the required number of children neither succeed or fail', () => {
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

  expect(BehaviorTreeStatus.Running).toEqual(testObject.Tick(time))

  expect(mockChild1.Tick).toBeCalledTimes(1)
  expect(mockChild2.Tick).toBeCalledTimes(1)
})
