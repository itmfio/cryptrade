import axios from 'axios'
import AWS from 'aws-sdk'
import fecha from 'fecha'

AWS.config.setPromisesDependency(null);

function convertMarketData(marketData, date) {
  const id = date + "_" + marketData.id
  return {
    ...marketData,
    ccy: marketData.id,
    id,
    date
  }
}

function createDBParam(marketDataList, date) {
  return {
    RequestItems: {
      "crypto-market-data": marketDataList.map((marketData) => {
        return {
          PutRequest: {
            Item: convertMarketData(marketData, date)
          }
        }
      })
    }
  }
}

function splitArray(array, chunkSize) {
  const result = []
  const len = array.length
  for (var i=0; i < len; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
  }
  return result
}

function batchWriteAll(docClient, dataList) {
  const date = fecha.format(new Date(), 'YYYYMMDD')
  const allDataList = splitArray(dataList, 25)
  return allDataList.reduce((last, chunked) => {
    const params = createDBParam(chunked, date)
    const fn = () => {
      return docClient.batchWrite(params).promise().then(() => {
        console.log("success insert db")
      })
    }
    if (last != null) {
      return last.then(fn)
    } else {
      return fn()
    }
  }, null)
}

export default () => {
  const url = "https://api.coinmarketcap.com/v1/ticker/?limit=50"

  // Make a request for a user with a given ID
  return axios.get(url)
    .then((response) => {
      if (response.data == null) {
        throw new Error("response is invalid")
      }
      const docClient = new AWS.DynamoDB.DocumentClient();
      return batchWriteAll(docClient, response.data)
    })
}
