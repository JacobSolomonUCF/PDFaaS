var request = require("request");
var fs = require("fs");

var options = { method: 'POST',
  url: 'http://127.0.0.1:3000/url/to/img',
  headers:
    { 'Content-Type': 'application/json' },
  body: { html: '', url: 'https://www.google.com' },
  json: true };

request.post(options, function (error, response, body) {
  if (error) throw new Error(error);

  fs.writeFile("output/urlToImg.jpeg", response.body.content, 'base64',
    function(err) {
      if (err) {
        console.log('err', err);
      }
      console.log('success');
    });
  console.log('inside');
});

