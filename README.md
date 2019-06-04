# ts-behavior-tree

A javascript/typescript behaviour tree library implementation of [Fluent-Behaviour-Tree](https://github.com/codecapers/Fluent-Behaviour-Tree)

[![Travis](https://img.shields.io/travis/robinxb/ts-behavior-tree.svg)](https://travis-ci.org/robinxb/ts-behavior-tree)
[![Coveralls](https://img.shields.io/coveralls/robinxb/ts-behavior-tree.svg)](https://coveralls.io/github/robinxb/ts-behavior-tree)
[![npm version](https://badge.fury.io/js/ts-behavior-tree.svg)](https://badge.fury.io/js/ts-behavior-tree)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Table of Contents
- [ts-behavior-tree](#ts-behavior-tree)
  - [Motivation](#motivation)
  - [Feature](#feature)
  - [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
    - [Scripts](#scripts)
  - [Usage](#usage)
  - [Development](#development)
    - [Clone the repository](#clone-the-repository)
    - [Use npm/yarn commands](#use-npmyarn-commands)

## Motivation

Although there is another js/ts library for fluent-behaviour-tree, but it uses `async/promise` to accomplish.

So I rewrite based on the origin C# implement. 🎉

## Feature

* Pure ES5
* Tiny (~5KB Minified)
* Full [Documented](https://robinxb.github.io/ts-behavior-tree)

## Installation

### npm

```bash
npm install ts-behavior-tree
```

### yarn

```bash
yarn add ts-behavior-tree
```

### Scripts

This library is supported with multiple formats (UMD, ES5)

You can get release versions of these from [releases page](https://github.com/robinxb/ts-behavior-tree/releases).

## Usage

You can find examples from [test/BehaviorTreeBuilder.test.ts](https://github.com/robinxb/ts-behavior-tree/blob/master/test/BehaviorTreeBuilder.test.ts).

Here is a simple usage

```javascript
import { BehaviorTreeBuilder, BehaviorTreeStatus, TimeData } from 'ts-behavior-tree'
const node = new BehaviorTreeBuilder()
.Sequence('aa')
.Do('aa', () => BehaviorTreeStatus.Failure)
.End()
.Build()
console.log(node.Tick(new TimeData()) === BehaviorTreeStatus.Failure)
```


## Development

### Clone the repository

```bash
git clone git@github.com:robinxb/ts-behavior-tree.git
```

### Use npm/yarn commands

* `npm t`: Run test suite
* `npm start`: Runs `npm run build` in watch mode
* `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
* `npm run test:prod`: Run linting and generate coverage
* `npm run build`: Generate bundles and typings, create docs
* `npm run lint`: Lints code
* `npm run commit`: Commit using conventional commit style \([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:\)