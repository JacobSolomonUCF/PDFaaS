const { openBrowser, loadPage } = require("chromiumBase");

/**
 *
 * @param page: <Page>
 *
 * @returns screenshot
 */
const getScreenshot = async (page) => {
  const options = {
    type: 'jpeg',
    encoding: 'base64'
  };

  console.log("Generate Image...");
  const img = await page.screenshot(options);

  return img;
};

/*

{
  html: <String> # HTML string of the content
  url: <String> # URL of the content
}

*/

exports.imgHandler = async (event, context, callback) => {
  const response = {};

  if (event.body !== null && event.body !== undefined) {
    const browser = await openBrowser();
    const body = JSON.parse(event.body);

    // Defaults for now
    const media = 'screen';
    const screenSize = {
      width: 1920,
      height: 1080,
    };

    let asHTML = false;
    var content = '';
    if(body.html && body.html !== ''){
      asHTML = true;
      content = body.html
    }else{
      content = body.url
    }
    const page = await loadPage(browser, content, media, screenSize, asHTML);
    const screenShot = await getScreenshot(page);

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: 'Success',
      content: screenShot
    });
    browser.close();
  }else{
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: 'No data in body',
      content: null,
    });
  }

  callback(null, response);
};