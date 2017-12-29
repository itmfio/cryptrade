import axios from 'axios'
import querystring from 'querystring'
import crypto from 'crypto'
import _ from 'lodash'

/**
  https://coincheck.com/ja/documents/exchange/api
 */
export default class Coincheck {

  constructor(accessKey, secretKey) {
    this.baseURL = "https://coincheck.jp"
    this.accessKey = accessKey
    this.secretKey = secretKey
  }

  ticker() {
    return this.getPublic('/api/ticker')
  }

  /**
    params {pair: 'btc_jpy'}
   */
  trades(params = {pair: 'btc_jpy'}) {
    return this.getPublic('/api/trades', params)
  }

  rate(pair) {
    return this.getPublic('/api/rate/' + pair)
  }

  rates(pairs) {
    return Promise.all(pairs.map((pair) => {
      return this.rate(pair).then((value) => {
        return [pair, value.rate]
      })
    })).then(_.fromPairs)
  }

  // Private api
  balance() {
    return this.getPrivate('/api/accounts/balance')
  }

  // Common

  getPublic(url, params) {
    return axios.get(this.baseURL + url, {params}).then((result) => result.data)
  }

  getPrivate(path, params) {
    const pathWithQuery = params ? path + querystring.stringify(params) : path
    const headers = this.createRequestHeader(pathWithQuery)
    return axios.get(this.baseURL + pathWithQuery, {
      params,
      headers
    }).then((result) => result.data)
  }

  postPrivate(path, requestBody) {
    const headers = this.createRequestHeader(path)
    console.log(headers)
    return axios.get(this.baseURL + path, {
      headers
    })
  }

  createRequestHeader(path, requestBody) {
    let nonce = new Date().getTime()
    if (this.lastNonce != null && this.lastNonce === nonce) {
      nonce++
    }
    this.lastNonce = nonce
    let url = this.baseURL + path
    let bodyString = requestBody ? JSON.stringify(requestBody) : ''
    let message = nonce + url + bodyString
    let signature = crypto.createHmac('sha256', this.secretKey).update(message).digest('hex')
    return {
      'ACCESS-KEY': this.accessKey,
      'ACCESS-NONCE': nonce,
      'ACCESS-SIGNATURE': signature,
    }
  }
}
