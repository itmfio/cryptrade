import AWS from 'aws-sdk'
import axios from 'axios'
import qs from 'querystring'

AWS.config.setPromisesDependency(null);

const kmsEncryptedHookUrl = process.env.kmsEncryptedHookUrl;
const slackChannel = process.env.slackChannel;
const kmsEncryptedToken = process.env.kmsEncryptedToken;

export default class SlackService {
  constructor() {
  }

  notifyToSlack(message) {
    const slackMessage = {
        channel: slackChannel,
        text: message
    };
    return this.decryptHookUrl().then((hookUrl) => {
      return axios.post(hookUrl, slackMessage)
    })
  }

  receiveSlackMessage(event, context, callback, commandDispatcher) {
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? (err.message || err) : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return this.decryptToken().then((token) => {
      return this.callackToSlack(event, done, commandDispatcher)
    })
  }

  callackToSlack(event, callback, commandDispatcher) {
      const params = qs.parse(event.body);
      const requestToken = params.token;
      if (requestToken !== token) {
          console.error(`Request token (${requestToken}) does not match expected`);
          throw new Error('Invalid request token')
      }

      return commandDispatcher(params).then((message) => {
        callback(null, message)
      })
  }

  /**
   * Slackに通知するためのURLを復号化します
   */
  decryptHookUrl() {
    if (this.hookUrl) {
      return new Promise((r) => r(this.hookUrl))
    } else {
      const encryptedBuf = new Buffer(kmsEncryptedHookUrl, 'base64');
      const cipherText = { CiphertextBlob: encryptedBuf };

      const kms = new AWS.KMS();
      return kms.decrypt(cipherText).promise().then((data) => {
          this.hookUrl = `https://${data.Plaintext.toString('ascii')}`;
          return this.hookUrl
      });
    }
  }

  /**
   * Slackからコマンド実行されるときのトークンを復号化します
   */
  decryptToken() {
    if (this.token) {
      return new Promise((resolve) => resolve(this.token))
    }
    if (!kmsEncryptedToken || kmsEncryptedToken === '<kmsEncryptedToken>') {
      return new Promise((r, reject) => reject(new Error('Token has not been set.')))
    }
    const cipherText = { CiphertextBlob: new Buffer(kmsEncryptedToken, 'base64') };
    const kms = new AWS.KMS();
    return kms.decrypt(cipherText).promise.then((data) => {
        this.token = data.Plaintext.toString('ascii');
        return this.token
    });
  }
}
