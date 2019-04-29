// const rp = require('request-promise-native');
const { openBrowser, loadPage } = require("chromiumBase");

exports.pdfHandler = async (event, context, callback) => {
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
    const pdf = await generatePDF(page, '', '', content, { displayHeaderFooter: false });

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: 'Success',
      content: pdf
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


/**
 * Converts the images from url to base64 with embedded images
 *
 * @param html
 * @returns {Promise<*>}
 */
const imageToBase64 = async (html) => {
  const imgs = html.match(/url\((")?(http(s)?:\/\/(?:www\.|(?!www))[^\s]{2,})(")?\)/g);
  if (!imgs) return html;
  for (let i = 0; i<imgs.length; i++){
    const url = imgs[i].substring(imgs[i].indexOf("http"),imgs[i].length-1).replace("\"","");
    var img = await rp({
      encoding: null,
      uri: url
    });
    const data = "data:image/png;base64," + new Buffer.from(img).toString('base64');
    html = html.replace(imgs[i],`url(${data})`);
  }
  return html;
};

/**
 * Generates a PDF stream
 *
 * @param page
 * @param header
 * @param footer
 * @param content
 * @param params
 * @returns {Promise<*>}
 */
const generatePDF = async (page, header, footer, content, params) => {
  const options = Object.assign({
    format: 'A4',
    headerTemplate: await imageToBase64(header || ""),
    footerTemplate: await imageToBase64(footer || ""),
    displayHeaderFooter: true,
  }, params);

  console.log("Generate PDF");
  return await page.pdf(options);
};
