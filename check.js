// CircleCI-Rebuild-Serverless - Copyright Conor O'Neill 2017, conor@conoroneill.com
// LICENSE Apache-2.0
// A Serverless AWS Lambda function that runs once per day and rebuilds a set of CircleCI projects.
// Don't forget to test with
// serverless invoke local --function check
// Using Node 6.10 on Lambda with Serverless so need to covert Node 8 specific things like async/await with Babel
// Do that with:
// npm run compile
// which converts check-source.js to check.js
"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var axios = require("axios");

var resp;

module.exports.check = (event, context, callback) => {
  var projects = process.env.CIRCLECI_REBUILD_PROJECTS.split(",").map(item => item.trim());
  callCircleCI(projects, callback);
};

function callCircleCI(_x, _x2) {
  return _callCircleCI.apply(this, arguments);
}

function _callCircleCI() {
  _callCircleCI = _asyncToGenerator(function* (projects, callback) {
    var gerr;

    for (var i = 0; i < projects.length; i++) {
      var circleURL = "https://circleci.com/api/v1.1/project/" + process.env.CIRCLECI_REBUILD_SCM + "/" + process.env.CIRCLECI_REBUILD_USER + "/" + projects[i] + "?circle-token=" + process.env.CIRCLECI_REBUILD_ACCESS_TOKEN;
      var hconfig = {
        headers: {
          "content-type": "application/json"
        },
        responseType: "json"
      };

      try {
        let response = yield axios.post(circleURL, hconfig);

        if (response.status >= 400 && response.status <= 550) {
          console.log("error:", response.status);
          gerr = response.status;
        } else {
          console.log("statusCode:", response && response.status);
          console.log("for project: ", projects[i]);
        }
      } catch (err) {
        console.log("error:", err);
        gerr = err;
      }
    }

    if (gerr) {
      resp = {
        statusCode: 500,
        body: "Error invoking rebuild of CircleCI projects: " + gerr
      };
    } else {
      resp = {
        statusCode: 200,
        body: "Invoked rebuild of CircleCI projects successfully."
      };
    }

    callback(null, resp);
  });
  return _callCircleCI.apply(this, arguments);
}

