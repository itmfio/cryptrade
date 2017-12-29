import {expect} from 'chai'
import {dummyBalance} from './ccTestData'
import {convertBalance} from '../../dist/api/ccUtil'

describe('ccUtil', () => {
  it('test convertBalance', () => {
    const balance = convertBalance(dummyBalance)
    expect(balance.cash.jpy).to.equal(50000)
    expect(balance.reserved.jpy).to.equal(5000)
    expect(balance.all.jpy).to.equal(55000)
  })
})
