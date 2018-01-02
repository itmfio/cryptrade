import AccountService from '../service/accountService'
import SlackService from '../service/slackService'
import _ from 'lodash'

const accountService = new AccountService()
const slackService = new SlackService()

export default function (event, context, callback) {
  slackService.receiveSlackMessage(event, context, callback, (params) => {
    // const user = params.user_name;
    const command = params.command;
    // const channel = params.channel_name;
    // const commandText = params.text;
    console.log(command)
    if (command === '/account') {
      return accountService.getTotalAccountInfoMessage()
    }
    throw new Error(`Invalid command ${command}`)
  }).then(() => {
      console.log("Success all")      
  }).catch(callback)
}
