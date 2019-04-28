const { openBrowser, loadPage } = require("chromiumBase");

exports.imgHandler = async (event, context, callback) => {
  const page = await openBrowser();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'HELLO from IMG',
      input: event,
    }),
  };

  page.close();

  callback(null, response);
};