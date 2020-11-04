'use strict'

const { spy } = require('sinon')
const chai = require('chai')

chai.should()

const limitOne = require('..')

function delayed() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, 30)
  })
}

describe('Limit to one', function () {
  it('should call fn immediatelly', function (done) {
    const spied = spy(delayed)
    const wrapped = limitOne(spied)

    spied.called.should.be.false
    wrapped()
      .then(function () {
        spied.calledOnce.should.be.true
        done()
      })
      .catch(done)
    spied.calledOnce.should.be.true
  })

  it('should not call fn if promise did not settle', function (done) {
    const spied = spy(delayed)
    const wrapped = limitOne(spied)

    spied.called.should.be.false
    wrapped().catch(done)
    wrapped()
      .then(function () {
        spied.calledOnce.should.be.true
        done()
      })
      .catch(done)
    spied.calledOnce.should.be.true
  })

  it('should call fn if promise already settled', function (done) {
    const spied = spy(delayed)
    const wrapped = limitOne(spied)

    spied.called.should.be.false
    wrapped().catch(done)
    spied.calledOnce.should.be.true

    setTimeout(function () {
      wrapped()
        .then(function () {
          spied.calledTwice.should.be.true
          done()
        })
        .catch(done)
      spied.calledTwice.should.be.true
    }, 45)
  })

  it('should resolve to fn promise', function () {
    const wrapped = limitOne(() => Promise.resolve('test'))

    return wrapped().then(function (result) {
      result.should.equal('test')
    })
  })

  it('should reject if fn rejects', function () {
    const wrapped = limitOne(() => Promise.reject(new Error('test')))

    return wrapped().catch(function (err) {
      err.message.should.equal('test')
    })
  })

  it('should work for non-promise-returning functions', function (done) {
    const sumOne = a => a + 1
    const spied = spy(sumOne)
    const wrapped = limitOne(spied)

    wrapped(2)
      .then(function (sum) {
        sum.should.equal(3)
        done()
      })
      .catch(done)
    spied.calledOnce.should.be.true
  })

  it('should throw on a second call if an error is provided', function (done) {
    const error = new Error('Call not accepted')

    const spied = spy(delayed)
    const wrapped = limitOne(spied, error)

    spied.called.should.be.false
    wrapped()
      .then(function () {
        spied.calledOnce.should.be.true
      })
      .catch(done)
    wrapped()
      .then(function () {
        done('Function should not have been called')
      })
      .catch(function (err) {
        spied.calledOnce.should.be.true
        err.should.equal(error)
        done()
      })
      .catch(done)
  })
})
