import express from 'express';
import puppeteer, {Browser} from 'puppeteer';

/**
 * Define express web server and puppeteer browser.
 */
const app = express();
let browser: null | Browser = null;

puppeteer.launch({
    // "npm run console -- debug" to set as non-headless for debugging
    headless: ! (process.argv[process.argv.length - 1] === 'debug'),
    defaultViewport: {width: 1800, height: 900},
}).then((b) => {
    browser = b;
});

/**
 * Browser remains open for the entire web server process. As requests come in, they
 * open a new tab and return the document body.
 *
 * 503 for browser not initialized (because async).
 * 400 for missing url query string parameter.
 * 200 for successful correct response.
 * 500 for unknown error when loading page.
 */
app.get('/proxy', async function (req: express.Request, res: express.Response): Promise<any> {
    if (browser === null) {
        return res.status(503).json({success: false, error: 'Browser not initialized. Try again shortly.'});
    } else if (! ('url' in req.query)) {
        return res.status(400).json({success: false, error: 'Query string parameter missing: url'});
    } else {
        const url = req.query.url as string;
        const page = await browser.newPage();

        try {
            await page.goto(url);

            const data = await page.evaluate(() => {
                return {success: true, document: document.documentElement.innerHTML};
            });

            await page.close();
            return res.status(200).json(data);
        } catch (e) {
            console.error('Could not proxy url.', {message: (e as Error).message, url, e})

            if (! page.isClosed()) {
                await page.close()
                return res.status(500).json({success: false, error: 'Could not proxy url'});
            }
        }
    }
});

/**
 * Close puppeteer on process exit.
 */
function signalHandler() {
    browser?.close();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);

/**
 * Allow port to be overwritten.
 */
app.listen(process.env?.EXPRESS_PUPPETEER_PROXY_PORT || 3000);

