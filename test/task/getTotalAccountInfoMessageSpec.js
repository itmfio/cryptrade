import {expect} from 'chai'
import getTotalAccountInfoMessage from '../../dist/task/getTotalAccountInfoMessage'

describe('getTotalAccountInfoMessage', () => {
  it('test get total account info', () => {
    return getTotalAccountInfoMessage().then((accountInfo) => {
      console.log(accountInfo)
    })
  })
})
