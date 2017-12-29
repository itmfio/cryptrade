import notifyToSlack from './task/notifyToSlack'
import getTotalAccountInfoMessage from './task/getTotalAccountInfoMessage'
import _ from 'lodash'

export default function (event, context, callback) {
  getTotalAccountInfoMessage().then(notifyToSlack).then(() => {
    console.log("Success all")
    callback()
  }).catch(callback)
}
