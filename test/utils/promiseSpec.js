import {expect} from 'chai'

describe('promise', () => {
  it('test resolve immediately', () => {
    return new Promise((resolve) => resolve(1)).then((value) => {
      expect(value).to.equal(1)
    })
  })
})
