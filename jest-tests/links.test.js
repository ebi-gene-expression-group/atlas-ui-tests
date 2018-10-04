import {Builder, By, until} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import fetch from 'node-fetch'

const getUrlFromHtmlElement = async (htmlElement) => {
  return await htmlElement.getAttribute('href')
}
const getUrlsFromHtmlElements = async (htmlElements) => {
  let queryURLs = []

  for(let element of htmlElements) {
    let url = await getUrlFromHtmlElement(element)
    queryURLs.push(url)
  }

  return queryURLs
}

const containsKnownFailure = (url) => {
  // TODO remove this filter when the cancer query is fixed (https://www.pivotaltracker.com/story/show/159763421)
  // and the problematic experiments are fixed (https://www.pivotaltracker.com/story/show/160954439)
  let knownFailures = ['E-GEOD-26284', 'E-GEOD-17610', 'E-MTAB-1624', 'E-TABM-713', 'cancer']

  for(let failure of knownFailures) {
    if(url.includes(failure)) {
      console.log(`Skipping ${url} as it contains known issues: ${failure}`)
      return true
    }
  }
  return false
}

const testUrlResponseCodeIsOk = async (urls) => {

  for(let url of urls) {
    if(!containsKnownFailure(url)) {
      console.log(`Fetching url ${url}`)
      const response = await fetch(url)
      // console.log(`response`, response)
      expect(response.status).toBe(200)
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

beforeAll(async () => {
  jest.setTimeout(60 * 1000); // 60 seconds
  driver = getWebdriver()
})

afterAll(() => {
  driver.quit()
})

xdescribe('Home page links', () => {
  beforeEach(async () => {
    await driver.get('https://www-test.ebi.ac.uk/gxa/')
  });

  it('All example queries return HTTP status 200', async () => {
    let geneExamples = await driver.findElement(By.id('home-search-atlas-form')).findElements(By.css('a'))

    let queryURLs = await getUrlsFromHtmlElements(geneExamples)

    await testUrlResponseCodeIsOk(queryURLs)
  })
})

xdescribe('Help page links', () => {
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
    await testUrlResponseCodeIsOk(queryUrls)
  })
})


describe('Experiment page links', () => {
  let randomExperimentUrl
  let allExperimentUrls

  beforeAll( async () => {
    await driver.get('https://www-test.ebi.ac.uk/gxa/experiments')
    await driver.findElement(By.name('experiments-table_length')).sendKeys('All')

    let links = await driver.wait(until.elementsLocated(By.css("a[title='View in Expression Atlas'")));

    expect(links.length).toBeGreaterThanOrEqual(3000)

    randomExperimentUrl = await getUrlFromHtmlElement(links[Math.floor(Math.random()*links.length)])
    allExperimentUrls = await getUrlsFromHtmlElements(links)
  })

  it('every experiment page returns 200', async () => {
    await testUrlResponseCodeIsOk(allExperimentUrls.reverse())
  }, 60 * 1000 * 10) // set timeout of 10 mins (!) for this test

  xit('checks tabs load correctly in a random experiment page', async () => {
    console.log(`Navigate to experiment page ${randomExperimentUrl}`)

    await driver.get(randomExperimentUrl)

  })
})

