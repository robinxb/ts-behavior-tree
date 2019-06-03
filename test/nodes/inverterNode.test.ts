import { BehaviorTreeStatus, TimeData, InverterNode, IBehaviorTreeNode } from '../../src/index'

import { ErrInvNodeMustHaveChild, ErrInvNodeMoreThanOneChild } from '../../src/errors'

let testObject: InverterNode

beforeEach(() => {
  testObject = new InverterNode('inv')
})

test('ticking with no child node throws exception', () => {
  expect(() => testObject.Tick(new TimeData())).toThrowError(ErrInvNodeMustHaveChild)
})

test('inverts success of child node', () => {
  const time = new TimeData(1)

  const mockChild = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Success
    })
  }))()
  testObject.AddChild(mockChild)

  expect(BehaviorTreeStatus.Failure).toEqual(testObject.Tick(time))
  expect(mockChild.Tick).toBeCalledTimes(1)
})

test('inverts failure of child node', () => {
  const time = new TimeData()

  const mockChild = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Failure
    })
  }))()
  testObject.AddChild(mockChild)

  expect(BehaviorTreeStatus.Success).toEqual(testObject.Tick(time))
  expect(mockChild.Tick).toBeCalledTimes(1)
})

test('pass through running of child node', () => {
  const time = new TimeData()

  const mockChild = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  testObject.AddChild(mockChild)

  expect(BehaviorTreeStatus.Running).toEqual(testObject.Tick(time))
  expect(mockChild.Tick).toBeCalledTimes(1)
})

test('adding more than a single child throws exception', () => {
  const time = new TimeData()

  const mockChild1 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  const mockChild2 = jest.fn<IBehaviorTreeNode, []>(() => ({
    Tick: jest.fn(() => {
      return BehaviorTreeStatus.Running
    })
  }))()
  testObject.AddChild(mockChild1)
  expect(() => testObject.AddChild(mockChild2)).toThrowError(ErrInvNodeMoreThanOneChild)
})
