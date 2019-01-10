const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www-test.ebi.ac.uk/gxa/experiments');

  const showAllExperimentsSelector = "select[name=experiments-table_length]"
  await page.waitForSelector(showAllExperimentsSelector)
  await page.select(showAllExperimentsSelector, "-1")

  const experimentsSelector = "a[title='View in Expression Atlas']";
  await page.waitForSelector(experimentsSelector);

  const links = await page.evaluate(resultsSelector => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
    return anchors.map(anchor => anchor.href);
  }, experimentsSelector);

  console.log(links.length)
  console.log(links.join('\n'));

  await browser.close();
})();