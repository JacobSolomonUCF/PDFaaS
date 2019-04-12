/**
 * opens a chromium instance
 * @returns {Promise<*>}
 */
const openBrowser = async () => {
    console.log("Launching chromium");
    return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless
    });
};

/**
 * Opens a new tab and loads the html content in it
 *
 * @param chromium
 * @param content
 * @param media
 * @param screenSize
 * @returns {Promise<!Promise<!Puppeteer.Page>|*>}
 */
const loadPage = async (chromium, content, media, screenSize) => {
    const page = await chromium.newPage();

    if (media) {
        console.log("Emulate media to screen");
        await page.emulateMedia(media);
    }
    if(screenSize){
        console.log("Setting screen size");
        await page.setViewport({ width: screenSize.width, height: screenSize.height});

    }

    console.log("Open page and wait...");
    // Old way
    // await page.goto(`data:text/html,${content}`, {waitUntil: 'networkidle0'});
    await page.setContent(content,{waitUntil: 'networkidle0'});

    return page;
};

module.exports = {
    openBrowser,
    loadPage
};