import Coincheck from "../api/coincheck"
import zaif from "zaif.jp"
import _ from "lodash"
import _s from 'underscore.string'
import {mergeBalance} from '../utils/balanceUtil'
import {convertBalance} from '../api/ccUtil'

const ccApiKey = process.env.CC_API_KEY
const ccApiSecret = process.env.CC_API_SECRET
const coincheck = new Coincheck(ccApiKey, ccApiSecret)

const zfApiKey = process.env.ZAIF_API_KEY
const zfApiSecret = process.env.ZAIF_API_SECRET

const zfPublicApi = zaif.PublicApi
const zfPrivateApi = zaif.createPrivateApi(zfApiKey, zfApiSecret, 'node-zaif')

export default class AccountService {
  constructor() {
  }

  /**
   * コインチェックの残高を取得します
   */
  getCCAccountInfo() {
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

  /**
   * Zaifの残高を取得します
   */
  getZaifAccountInfo() {
    return zfPrivateApi.getInfo().then((accountInfo) => {
      const requestList = _.map(accountInfo.deposit, (value, ccy) => {
        // 円の場合はそのまま返す
        if (ccy === "jpy") {
          return {
            ccy,
            value
          }
        }
        // 数量0はnull
        if (value === 0) {
          return
        }
        // 円転評価額を算出
        return zfPublicApi.ticker(ccy + "_jpy").then((ticker) => {
            return {
              ccy,
              value: ticker.bid * value
            }
        })
      })

      return Promise.all(requestList).then((allResult) => {
        const results = {}
        allResult.forEach((values) => {
          if (values != null) {
            results[values.ccy.toLowerCase()] = values.value
          }
        })
        return results
      })
    })
  }

  getTotalAccountInfo() {
    return Promise.all([this.getZaifAccountInfo(), this.getCCAccountInfo()])
      .then(([zaif, coincheck]) => {
        return mergeBalance({
          zaif,
          coincheck
        })
    })
  }

  getTotalAccountInfoMessage () {
    return this.getTotalAccountInfo().then((merged) => {
      const messages = []
      messages.push(['総資産', merged.all])
      messages.push([])
      messages.push(['Zaif', merged.cp.zaif])
      messages.push(['Coincheck', merged.cp.coincheck])
      messages.push([])

      _(merged.ccy).toPairs().sortBy((pair) => -pair[1]).value().forEach((pair) => {
        messages.push([pair[0].toUpperCase(), pair[1]])
      })
      console.log("get account info:" + merged.all)
      return messages.map((pair) => {
        if (pair.length == 0) {
          return '----'
        }
        return ` ${pair[0]}: ${_s.numberFormat(pair[1])}`
      }).join('\n')
    })
  }
}
