'use strict';

import AWS from 'aws-sdk'
import axios from 'axios'

// The base-64 encoded, encrypted key (CiphertextBlob) stored in the kmsEncryptedHookUrl environment variable
const kmsEncryptedHookUrl = process.env.kmsEncryptedHookUrl;
// The Slack channel to send a message to stored in the slackChannel environment variable
const slackChannel = process.env.slackChannel;
let hookUrl;

function processEvent(event, callback) {

    const slackMessage = {
        channel: slackChannel,
        text: 'Hello Lambda 2' // `${alarmName} state is now ${newState}: ${reason}`,
    };

    axios.post(hookUrl, slackMessage)
      .then(function (response) {
        console.log(response);
        callback(null)
      })
      .catch(function (error) {
        console.log(error);
        callback(null)
      });
}

export default function (message) {
  if (hookUrl) {
      // Container reuse, simply process the event with the key in memory
      processEvent(event, callback);
  } else if (kmsEncryptedHookUrl && kmsEncryptedHookUrl !== '<kmsEncryptedHookUrl>') {
      const encryptedBuf = new Buffer(kmsEncryptedHookUrl, 'base64');
      const cipherText = { CiphertextBlob: encryptedBuf };

      const kms = new AWS.KMS();
      kms.decrypt(cipherText, (err, data) => {
          if (err) {
              console.log('Decrypt error:', err);
              return callback(err);
          }
          hookUrl = `https://${data.Plaintext.toString('ascii')}`;
          processEvent(event, callback);
      });
  } else {
      callback('Hook URL has not been set.');
  }
}
