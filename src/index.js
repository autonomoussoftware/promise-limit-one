'use strict'

/**
 * Creates a function that when called multiple times will call ´fn´ and wait
 * for it to finish before calling it again.
 *
 * @param {Function} fn Function that returns a promise.
 * @returns {Function} A function that wraps `fn` up. It will return a promise
 *                     that will resolve to the result of calling `fn`. While
 *                     `fn` is busy, it will resolve to the pending promise.
 */
function notIfBusy (fn) {
  let promise = null

  return function (...args) {
    function clear () {
      promise = null
    }

    // Call `fn` if no previous call is pending and then clear the promise ref
    if (!promise) {
      promise = Promise.resolve(fn(...args))
      promise.then(clear, clear)
    }

    return promise
  }
}

module.exports = notIfBusy
