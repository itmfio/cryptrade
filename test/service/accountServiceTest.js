import {expect} from 'chai'
import AccountService from '../../dist/service/accountService'

let accountService;

describe('Coincheck', () => {

  before(() => {
    accountService = new AccountService()
  })

  describe('getCCAccountInfo', () => {
    it('test get coincheck accountInfo', () => {
      return accountService.getCCAccountInfo().then((accountInfo) => {
        console.log(accountInfo);
        expect(accountInfo).to.have.property('jpy')
      })
    })

    it('test get zaif accountInfo', () => {
      return accountService.getZaifAccountInfo().then((accountInfo) => {
        console.log(accountInfo);
        expect(accountInfo).to.have.property('jpy')
      })
    })

    it('test get total accountInfo', () => {
      return accountService.getTotalAccountInfo().then((accountInfo) => {
        console.log(accountInfo);
        expect(accountInfo.all > 0).to.true
        expect(accountInfo.cp).to.have.property('coincheck')
        expect(accountInfo.ccy).to.have.property('jpy')
      })
    })
  })
})
