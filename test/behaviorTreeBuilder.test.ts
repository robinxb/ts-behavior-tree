import {
  BehaviorTreeBuilder,
  BehaviorTreeStatus,
  InverterNode,
  TimeData,
  SequenceNode,
  ParallelNode,
  SelectorNode
} from '../src/index'
import {
  ErrZeroNodes,
  ErrUnnestedTree,
  ErrInvNodeMoreThanOneChild,
  ErrorSpliceUnnested
} from '../src/errors'

let testObject: BehaviorTreeBuilder

beforeEach(() => {
  testObject = new BehaviorTreeBuilder()
})

test('cant create a behavior tree with zero nodes', () => {
  expect(() => testObject.Build()).toThrow(ErrZeroNodes)
})

test('cant create an unested action node', () => {
  expect(() => testObject.Do('some-node-1', t => BehaviorTreeStatus.Running).Build()).toThrow(
    ErrUnnestedTree
  )
})

test('can create inverter node', () => {
  let node = testObject
    .Inverter('inv')
    .Do('some-node', t => BehaviorTreeStatus.Success)
    .End()
    .Build()
  expect(node).toBeInstanceOf(InverterNode)
  expect(node.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Failure)
})

test('cant create an unbalanced behavior tree', () => {
  expect(() =>
    testObject
      .Inverter('inv')
      .Do('some-node', t => BehaviorTreeStatus.Success)
      .Build()
  ).toThrowError(ErrZeroNodes)
})

test('condition is syntactic sugar for do', () => {
  let returnFn = jest
    .fn()
    .mockReturnValueOnce(true)
    .mockReturnValue(false)
  let node = testObject
    .Inverter('inv')
    .Condition('some-node', t => returnFn())
    .End()
    .Build()
  expect(node).toBeInstanceOf(InverterNode)
  expect(node.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Failure)
  expect(node.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Success)
})

test('can invert an inverter', () => {
  let node = testObject
    .Inverter('inv')
    .Inverter('some-inverter')
    .Inverter('some-other-inverter')
    .Do('some-node', t => BehaviorTreeStatus.Success)
    .End()
    .End()
    .Build()
  expect(node).toBeInstanceOf(InverterNode)
  expect(node.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Success)
})

test('adding more than a single child to inverter throws exception', () => {
  expect(() =>
    testObject
      .Inverter('inv')
      .Do('some-node', t => BehaviorTreeStatus.Success)
      .Do('some-node', t => BehaviorTreeStatus.Success)
      .End()
      .Build()
  ).toThrowError(ErrInvNodeMoreThanOneChild)
})

test('can create a sequance', () => {
  let invokeCount = 0
  let sequance = testObject
    .Sequence('some-sequance')
    .Do('some-action-1', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .Do('some-action-2', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .End()
    .Build()

  expect(sequance).toBeInstanceOf(SequenceNode)
  expect(sequance.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Success)
  expect(invokeCount).toEqual(2)
})

test('can create parallel', () => {
  let invokeCount = 0
  let parallel = testObject
    .Parallel('some-parallel', 2, 2)
    .Do('some-action-1', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .Do('some-action-2', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .End()
    .Build()

  expect(parallel).toBeInstanceOf(ParallelNode)
  expect(parallel.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Success)
  expect(invokeCount).toEqual(2)
})

test('can create selector', () => {
  let invokeCount = 0
  let selector = testObject
    .Selector('some-selector')
    .Do('some-action-1', t => {
      ++invokeCount
      return BehaviorTreeStatus.Failure
    })
    .Do('some-action-2', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .End()
    .Build()

  expect(selector).toBeInstanceOf(SelectorNode)
  expect(selector.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Success)
  expect(invokeCount).toEqual(2)
})

test('can splice sub tree', () => {
  let invokeCount = 0
  let spliced = testObject
    .Sequence('spliced')
    .Do('test', t => {
      ++invokeCount
      return BehaviorTreeStatus.Success
    })
    .End()
    .Build()

  let tree = testObject
    .Sequence('parent-tree')
    .Splice(spliced)
    .End()
    .Build()

  expect(() => tree.Tick(new TimeData())).not.toThrow()
  expect(invokeCount).toEqual(1)
})

test('parent node stack test', () => {
  const testfn = jest.fn()
  let node = testObject
    .Sequence('some-seq')
    .Do('test1', t => BehaviorTreeStatus.Success)
    .Sequence('some-seq-2')
    .Do('test2', t => BehaviorTreeStatus.Success)
    .Selector('sel')
    .Parallel('some-parral', 2, 2)
    .Do('pa-sub-1', t => BehaviorTreeStatus.Failure)
    .Do('pa-sub-2', t => BehaviorTreeStatus.Failure)
    .End()
    .Do('sel-sub-1', t => {
      testfn()
      return BehaviorTreeStatus.Failure
    })
    .Do('sel-sub-2', t => BehaviorTreeStatus.Running)
    .End()
    .End()
    .End()
    .Build()

  expect(node.Tick(new TimeData())).toEqual(BehaviorTreeStatus.Running)
  expect(testfn).toBeCalledTimes(1)
})

test('splice an unnested sub tree throws exception', () => {
  let spliced = testObject
    .Sequence('spliced')
    .Do('test', t => {
      return BehaviorTreeStatus.Success
    })
    .End()
    .Build()

  expect(() => testObject.Splice(spliced)).toThrow(ErrorSpliceUnnested)
})
