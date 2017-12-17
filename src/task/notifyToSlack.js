import AWS from 'aws-sdk'
import axios from 'axios'

AWS.config.setPromisesDependency(null);

// The base-64 encoded, encrypted key (CiphertextBlob) stored in the kmsEncryptedHookUrl environment variable
const kmsEncryptedHookUrl = process.env.kmsEncryptedHookUrl;
// The Slack channel to send a message to stored in the slackChannel environment variable
const slackChannel = process.env.slackChannel;
let hookUrl;

function processEvent(message) {

    const slackMessage = {
        channel: slackChannel,
        text: message
    };

    return axios.post(hookUrl, slackMessage)
}

export default function (message) {
  if (hookUrl) {
      // Container reuse, simply process the event with the key in memory
      return processEvent(message);
  } else if (kmsEncryptedHookUrl && kmsEncryptedHookUrl !== '<kmsEncryptedHookUrl>') {
      const encryptedBuf = new Buffer(kmsEncryptedHookUrl, 'base64');
      const cipherText = { CiphertextBlob: encryptedBuf };

      const kms = new AWS.KMS();
      return kms.decrypt(cipherText).promise().then((data) => {
          hookUrl = `https://${data.Plaintext.toString('ascii')}`;
          processEvent(message);
      });
  }
}
