// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Request on Unsubscribe
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/unsubscribe.html");
});

// PATCH Request on Unsubscribe
app.patch("/", (req, res) => {
  const { email } = req.body;
  const data = {
    members: [
      {
        status: "unsubscribed"
      }
    ]
  };
  const api_email = email.toLowerCase();
  let hash = crypto
    .createHash("md5")
    .update(api_email)
    .digest("hex");

  const JSONData = JSON.stringify(data);

  if (!firstname || !lastname || !email) {
    res.sendFile(__dirname + "/failed.html");
    res.status(400);
  } else {
    if (res.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.status(400);
      res.sendFile(__dirname + "/failed.html");
    }
  }
  const options = {
    url: `https://us18.api.mailchimp.com/3.0/lists/8bd6f842d1/members/${hash}`,
    method: "PATCH",
    headers: {
      Authorization: "auth deed85fccbcc5e5f0f54d7acb8629242-us18"
    },
    body: JSONData
  };

  request(options, (err, response, body) => {
    console.log(response.statusCode);
    console.log(hash);
    //console.log(`PATCH REQUEST FOR UNSUBSCRIBE ${body}`);
  });
});

app.listen(5000, console.log("TEST Server ON - Port : 5000"));
