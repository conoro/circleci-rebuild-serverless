// CircleCI-Rebuild-Serverless - Copyright Conor O'Neill 2017, conor@conoroneill.com
// LICENSE Apache-2.0
// A Serverless AWS Lambda function that runs once per day and rebuilds a set of CircleCI projects.

"use strict";

var request = require("request");

module.exports.check = (event, context, callback) => {
  var projects = process.env.CIRCLECI_REBUILD_PROJECTS.split(",").map(item =>
    item.trim()
  );

  var gerr;

  for (var i = 0; i < projects.length; i++) {
    var circleURL =
      "https://circleci.com/api/v1.1/project/" +
      process.env.CIRCLECI_REBUILD_SCM +
      "/" +
      process.env.CIRCLECI_REBUILD_USER +
      "/" +
      projects[i] +
      "?circle-token=" +
      process.env.CIRCLECI_REBUILD_ACCESS_TOKEN;

    var headersOpt = {
      "content-type": "application/json"
    };

    request(
      {
        method: "POST",
        url: circleURL,
        headers: headersOpt,
        json: true
      },
      function(error, response, body) {
        if (response.statusCode >= 400 && response.statusCode <= 550) {
          console.log("error:", error); // Print the error if one occurred
          gerr = error;
        } else {
          console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
          console.log("body:", body);
        }
        // If this is the last request to CircleCI then complete callback to Lambda
        if (i == projects.length) {
          if (gerr) {
            const resp = {
              statusCode: 500,
              body: "Error: " + error
            };
            callback(null, resp);
          } else {
            const resp = {
              statusCode: 200,
              body: "Rebuilt CircleCI OK."
            };
            callback(null, resp);
          }
        }
      }
    );
  }
};
