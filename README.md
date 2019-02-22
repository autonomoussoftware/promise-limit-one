# promise-not-if-busy

[![Build Status](https://travis-ci.com/autonomoussoftware/promise-not-if-busy.svg?branch=master)](https://travis-ci.com/autonomoussoftware/promise-not-if-busy)

Wrap a function so if called multiple times, only one call runs simultaneously.

## Installation

```shell
npm install promise-not-if-busy
```

## Usage

```js
const notIfBusy = require('promise-not-if-busy')

const wrapped = notIfBusy(longOperation)

wrapped() // will call `longOperation` and resolve to the call's results

wrapped() // will not call `longOperation` as it will take long to finish but will resolve to previous call results instead

// after `longOperation` ends...

wrapped() // will call `longOperation` again and resolve to this call's results
```

## API

### `notIfBusy(fn)`

Creates a function that when called multiple times will call ´fn´ and wait for it to
finish before calling it again. 

#### Params

`fn`:
Function that returns a promise.

#### Returns

A function that wraps `fn` up.
It will return a promise that will resolve to the result of calling `fn`.
While `fn` is busy, it will resolve to the pending promise.


## License

MIT
