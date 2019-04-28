var request = require("request");

const host = "http://localhost:3000/";
//http://127.0.0.1:3000/url/to/img
var options = { method: 'GET',
  url: host + 'url/to/img',
  headers:
    {'cache-control': 'no-cache' }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
