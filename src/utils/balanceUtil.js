import _ from 'lodash'


/**
 * 想定: {coincheck: {}, zaif: {}}
 */
export function mergeBalance(balances) {
  let resultAll = 0
  let resultForCP = {}
  let resultForCcy = {}
  const mergeValue = (object, key, value) => {
    object[key] = (object[key] || 0) + Number(value)
  }
  _.forEach(balances, (balance, cp) => {
    _.forEach(balance, (amount, ccy) => {
      mergeValue(resultForCP, cp, amount)
      mergeValue(resultForCcy, ccy, amount)
      resultAll += amount
    })
  })
  return {
    all: resultAll,
    cp: resultForCP,
    ccy: resultForCcy
  }
}
