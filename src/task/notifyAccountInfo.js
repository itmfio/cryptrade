import AccountService from '../service/accountService'
import SlackService from '../service/slackService'
import _ from 'lodash'

const accountService = new AccountService()
const slackService = new SlackService()

export default function (event, context, callback) {
  accountService.getTotalAccountInfoMessage()
    .then(slackService.notifyToSlack.bind(slackService))
    .then(() => {
      console.log("Success all")
      callback()
  }).catch(callback)
}
