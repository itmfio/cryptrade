import axios from 'axios'

const baseURL = "https://api.coinmarketcap.com/v1"

export default class CoinMarketCap {
  constructor() {
  }

  ticker(params = {limit: 50}) {
    return axios.get(baseURL + '/ticker', {params}).then((response) => {
      return response.data
    })
  }
}
