"use strict";

var getMarketData = require("./dist/getMarketData").default;

exports.handler = function (event, context) {
  getMarketData().then(function () {
    console.log("success all");
    context.done();
  }).catch(function (error) {
    console.log(error);
    context.done();
  });
};
