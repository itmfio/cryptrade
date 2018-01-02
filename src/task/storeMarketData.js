import axios from 'axios'
import AWS from 'aws-sdk'
import fecha from 'fecha'
import {createPutDBParam, batchWriteAll} from '../utils/dynamoDBUtil'
import CoinMarketCap from '../api/coinMarketCap'

AWS.config.setPromisesDependency(null);

const coinMarketCap = new CoinMarketCap()

function convertMarketData(marketData, date) {
  const id = date + "_" + marketData.id
  return {
    ...marketData,
    ccy: marketData.id,
    id,
    date
  }
}

export default () => {
  const url = "https://api.coinmarketcap.com/v1/ticker/?limit=50"

  // Make a request for a user with a given ID
  return coinMarketCap.ticker()
    .then((data) => {
      const docClient = new AWS.DynamoDB.DocumentClient();
      const date = fecha.format(new Date(), 'YYYYMMDD')
      const insertDataList = data.map((record) => {
        return convertMarketData(record, date)
      })
      return batchWriteAll(docClient, insertDataList, "crypto-market-data-2")
    })
}
