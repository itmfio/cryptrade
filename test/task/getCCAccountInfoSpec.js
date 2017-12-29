import {expect} from 'chai'
import getCCAccountInfo from '../../dist/task/getCCAccountInfo'

describe('Coincheck', () => {

  describe('getCCAccountInfo', () => {
    it('test get accountInfo', () => {
      return getCCAccountInfo().then((accountInfo) => {
        console.log(accountInfo)
      })
    })
  })
})
