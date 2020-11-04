# promise-limit-one

[![Build Status](https://travis-ci.com/autonomoussoftware/promise-limit-one.svg?branch=master)](https://travis-ci.com/autonomoussoftware/promise-limit-one)

Wrap a function so if called multiple times, only one call runs simultaneously.

## Installation

```shell
npm install promise-limit-one
```

## Usage

```js
const limitOne = require('promise-limit-one')

const longOperation = () => new Promise(function (resolve) {
  console.log('Executing a long operation...')
  setTimeout(resolve, 100)
})

const wrapped = limitOne(longOperation)

wrapped() // will print "Executing..."
wrapped() // will do nothing

setTimeout(function () {
  wrapped() // will print "Executing..." again
}, 150)
```

## API

### `limitOne(fn, err)`

Creates a function that when called multiple times will call `fn` and wait for it to finish before calling `fn` again. 

If `err` is supplied and the function is running, any new call will reject with `err`.

#### Params

`fn`:
Function that returns a promise.

#### Returns

A function that wraps `fn` up.
It will return a promise that will resolve to the result of calling `fn`.
While `fn` is busy, it will resolve to the pending promise.

## License

MIT
