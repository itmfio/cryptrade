import {expect} from 'chai'
import Coincheck from '../../dist/api/coincheck'

let coincheck;

describe('Coincheck', () => {
  before(() => {
    const apiKey = process.env.CC_API_KEY
    const apiSecret = process.env.CC_API_SECRET
    coincheck = new Coincheck(apiKey, apiSecret)
  })

  describe('publicApi', () => {
    it('test get ticker', () => {
      return coincheck.ticker().then((ticker) => {
        expect(ticker).to.have.property('last')
      })
    })

    it('test get trades', () => {
      return coincheck.trades().then((trades) => {
        expect(trades.data.length > 0).to.be.true
      })
    })

    it('test rate', () => {
      return coincheck.rate('btc_jpy').then((rate) => {
        expect(rate).to.have.property('rate')
      })
    })

    it('test rates', () => {
      return coincheck.rates(['btc_jpy', 'eth_jpy']).then((rate) => {
        console.log(rate)
        expect(rate).to.have.property('btc_jpy')
        expect(rate).to.have.property('eth_jpy')
      })
    })
  })

  describe('privateApi', () => {
    it('test get balance', () => {
      return coincheck.balance().then((balance) => {
        expect(balance).to.have.property('jpy')
      })
    })
  })
})
