import getZaifAccountInfo from './getZaifAccountInfo'
import getCCAccountInfo from './getCCAccountInfo'
import _ from 'lodash'
import _s from 'underscore.string'
import {mergeBalance} from '../utils/balanceUtil'

export default function () {
  return Promise.all([getZaifAccountInfo(), getCCAccountInfo()]).then(([zaif, coincheck]) => {
    const merged = mergeBalance({
      zaif,
      coincheck
    })
    const messages = []
    messages.push(['総資産', merged.all])
    messages.push([])
    messages.push(['Zaif', merged.cp.zaif])
    messages.push(['Coincheck', merged.cp.coincheck])
    messages.push([])

    _(merged.ccy).toPairs().sortBy((pair) => -pair[1]).value().forEach((pair) => {
      messages.push([pair[0].toUpperCase(), pair[1]])
    })

    return messages.map((pair) => {
      if (pair.length == 0) {
        return '----'
      }
      return ` ${pair[0]}: ${_s.numberFormat(pair[1])}`
    }).join('\n')
  })
}
