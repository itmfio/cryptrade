import zaif from "zaif.jp"
import _ from "lodash"

const apiKey = process.env.ZAIF_API_KEY
const apiSecret = process.env.ZAIF_API_SECRET

const publicApi = zaif.PublicApi
const privateApi = zaif.createPrivateApi(apiKey, apiSecret, 'node-zaif')

export default function () {
  return privateApi.getInfo().then((accountInfo) => {
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
      return publicApi.ticker(ccy + "_jpy").then((ticker) => {
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
          results[values.ccy] = values.value
        }
      })
      return results
    })
  })
}
