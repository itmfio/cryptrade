import axios from 'axios'
import AWS from 'aws-sdk'
import fecha from 'fecha'

AWS.config.setPromisesDependency(null);

export function createPutDBParam(dataList, tableName) {
  return {
    RequestItems: {
      [tableName]: dataList.map((data) => {
        return {
          PutRequest: {
            Item: data
          }
        }
      })
    }
  }
}

export function splitArray(array, chunkSize) {
  const result = []
  const len = array.length
  for (var i=0; i < len; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
  }
  return result
}

/**
 * 25件を超えるデータをバッチインサートします
 */
export function batchWriteAll(docClient, dataList, tableName) {
  const allDataList = splitArray(dataList, 25)
  return allDataList.reduce((last, chunked) => {
    const params = createPutDBParam(chunked, tableName)
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
