import Coincheck from "../api/coincheck"
import _ from "lodash"
import {convertBalance} from '../api/ccUtil'

const apiKey = process.env.CC_API_KEY
const apiSecret = process.env.CC_API_SECRET

const coincheck = new Coincheck(apiKey, apiSecret)

export default function () {
  return coincheck.balance().then((orgBalance) => {
    const balance = convertBalance(orgBalance)
    const ccyList = _(balance.cash)
      .toPairs()
      .filter((ccyPair) => ccyPair[0] != 'jpy' && ccyPair[1] > 0)
      .map((ccyPair) => ccyPair[0] + '_jpy')
      .value();
    return coincheck.rates(ccyList).then((rates) => {
      const result = {}
      _.forEach(balance.all, (value, ccy) => {
        if (value == 0) {
          return
        }
        if (ccy == 'jpy') {
          result[ccy] = value
        } else {
          result[ccy] = value * rates[ccy + '_jpy']
        }
      })
      return result
    })
  })
}
