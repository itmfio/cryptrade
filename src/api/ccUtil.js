import _ from 'lodash'

/**
 * 残高データを変換します
 */
export function convertBalance(balance) {
  // TODO 信用取引未対応
  const result = {
    cash: {},
    reserved: {},
    all: {}
  }

  if (!balance.success) {
    return result
  }

  _.forEach(balance, (value, ccy) => {
    if (ccy == 'success') {
      return
    }
    const numValue = Number(value)
    if (ccy.endsWith('_lend_in_use') ||
      ccy.endsWith('_lent') ||
      ccy.endsWith('_debt')) {
      return
    }
    if (ccy.endsWith('_reserved')) {
      const ccyConv = ccy.replace('_reserved', '')
      result.reserved[ccyConv] = numValue
      result.all[ccyConv] = (result.all[ccyConv] || 0) + numValue
      return
    }
    result.cash[ccy] = numValue
    result.all[ccy] = (result.all[ccy] || 0) + numValue
  })
  return result
}
