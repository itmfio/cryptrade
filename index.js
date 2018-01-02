"use strict";

var fn = null;
switch (process.env.FN_NAME) {
  case "getMarketData":
    fn = require("./dist/task/getMarketData").default;
    break;
  case "notifyAccountInfo":
    fn = require("./dist/task/notifyAccountInfo").default;
    break;
  case "receiveSlackCommand":
    fn = require("./dist/task/receiveSlackCommand").default;
    break;
  default:
}

exports.handler = fn
