// Imports
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
// const { getScreenshot, loadPage } = require('./lib/screenshot');

/**
 *
 * @param event
 * @param context
 * @param callback
 * @return {Promise<*>}
 */
exports.lambdaHandler = async (event, context, callback) => {
    let result = null;
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        let page = await browser.newPage();

        await page.goto(event.url || 'https://example.com');

        result = await page.screenshot({encoding: 'base64'});
    } catch (error) {
        return context.fail(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'image/png' },
        body: result,
        isBase64Encoded: true
    })
};
