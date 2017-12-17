import getAccountInfo from './task/getAccountInfo'
import notifyToSlack from './task/notifyToSlack'
import _ from 'lodash'
import _s from 'underscore.string'

export default function (event, context, callback) {
  getAccountInfo().then((accountInfo) => {
    // const message = JSON.stringify(accountInfo)
    const totalAmount = _.sum(_.values(accountInfo))
    let message = `総資産: ${_s.numberFormat(totalAmount, 1)}`
    _.forEach(accountInfo, (value, ccy) => {
      message += `\n${ccy}: ${_s.numberFormat(value, 1)}`
    })
    return notifyToSlack(message)
  }).then(() => {
    console.log("Success all")
    callback()
  }).catch(callback)
}
