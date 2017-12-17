"use strict";

var getMarketData = require("./dist/getMarketData").default;
var notifyToSlack = require("./dist/notifyToSlack").default;
var getAccountInfo = require("./dist/getAccountInfo").default;

// exports.handler = function (event, context) {
//   getMarketData().then(function () {
//     console.log("success all");
//     context.done();
//   }).catch(function (error) {
//     console.log(error);
//     context.done();
//   });
// };

exports.handler = function (event, context, callback) {
  getAccountInfo().then((accountInfo) => {
    const message = JSON.stringify(accountInfo)
    return notifyToSlack(message).then(() => {
      callback()
    })
  }).catch((error) => {
    callback(error)
  })
}
