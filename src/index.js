'use strict'

/**
 * Creates a function that when called multiple times will call `fn` and wait
 * for it to finish before calling `fn` again.
 *
 * @param {Function} fn Function that returns a promise.
 * @param {Error} [err] The error to throw if a call is in progress.
 * @returns {Function} A function that wraps `fn` up. It will return a promise
 *                     that will resolve to the result of calling `fn`. While
 *                     `fn` is busy, it will resolve to the pending promise.
 */
function limitOne(fn, err) {
  let promise = null

  return function (...args) {
    const clear = function () {
      promise = null
    }

    if (!promise) {
      // Call `fn` if no previous call is running and then clear the promise
      // reference
      promise = Promise.resolve(fn(...args))
      promise.then(clear, clear)
    } else if (err) {
      // But if a previous call is in progress and an error was provided, throw
      return Promise.reject(err)
    }

    return promise
  }
}

module.exports = limitOne
