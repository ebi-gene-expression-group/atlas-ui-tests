import {Builder, By, until} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import fetch from 'node-fetch'

const getUrlsFromHtmlElements = async (htmlElements) => {
  let queryURLs = []

  for(let element of htmlElements) {
    let url = await element.getAttribute('href')
    queryURLs.push(url)
  }

  return queryURLs
}

const testUrlResponseCodeIsOk = async (urls) => {
  for(let url of urls) {
    // TODO remove this filter when the cancer query is fixed (https://www.pivotaltracker.com/story/show/159763421)
    if(!url.includes('cancer')) {
      console.log(`Fetching url ${url}`)
      const response = await fetch(url)
      expect(response.ok).toBe(true)
    }

  }
}

const getWebdriver = () => {
  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options()
        .headless()
        .windowSize({width: 1280, height: 1024})
        .addArguments("--no-sandbox")
    )
    .build()
}

let driver
beforeAll(() => {
  jest.setTimeout(60 * 1000); // 60 seconds
  driver = getWebdriver()
})

afterAll(() => {
  driver.quit()
})

describe('Home page links', () => {
  beforeEach(async () => {
    await driver.get('https://www-test.ebi.ac.uk/gxa/')
  });

  it('All example queries return HTTP status 200', async () => {
    let geneExamples = await driver.findElement(By.id('home-search-atlas-form')).findElements(By.css('a'))

    let queryURLs = await getUrlsFromHtmlElements(geneExamples)

    await testUrlResponseCodeIsOk(queryURLs)
  })
})

describe('Help page links', () => {
  beforeEach(async () => {
    await driver.get('https://www-test.ebi.ac.uk/gxa/help/index.html')
  });

  it('All More help internal links on the right side of the page are valid', async () => {
    let internalLinks = await driver.findElement(By.id('main-content-area')).findElement(By.css('ul')).findElements(By.css('a'))

    let queryUrls = await getUrlsFromHtmlElements(internalLinks)

    await testUrlResponseCodeIsOk(queryUrls)
  })

  xit('All links within the help page text are valid', async () => {
    let links = await driver.findElement(By.id('main-content-area')).findElement(By.className('columns')).findElements(By.css('a'))

    let queryUrls = await getUrlsFromHtmlElements(links)

    // TODO Should we be testing external links such as GitHub repos, Reactome, Bioconductor
    await testUrlResponseCode(queryUrls)
  })
})

describe('Experiment page links', () => {
  let randomExperimentUrl

  beforeAll( async () => {
    await driver.get('https://www-test.ebi.ac.uk/gxa/experiments')
    await driver.findElement(By.name('experiments-table_length')).sendKeys('All')

    console.log('Wait for experiments table to load')
    await driver.sleep(5000)

    console.log('Retrieve experiment URLs')
    let links = await driver.findElements(By.css("a[title='View in Expression Atlas'"))

    let experimentUrls = await getUrlsFromHtmlElements(links)

    randomExperimentUrl = experimentUrls[Math.floor(Math.random()*experimentUrls.length)];
  })

  it('checks experiment page tabs load correctly', async () => {
    console.log(`Navigate to experiment page ${randomExperimentUrl}`)

    await driver.get(randomExperimentUrl)

  })
})