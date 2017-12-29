import {expect} from 'chai'
import {mergeBalance} from '../../dist/utils/balanceUtil'
import {balanceCC, balanceZaif} from './testData'

describe('balanceUtil', () => {
  it('test get mergeBalance', () => {
    const merged = mergeBalance({
      coincheck: balanceCC,
      zaif: balanceZaif
    })
    console.log(merged)
  })
})
