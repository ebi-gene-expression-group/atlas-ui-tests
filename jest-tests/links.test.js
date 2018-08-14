import {Builder, By, until} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import fetch from 'node-fetch'

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
    await driver.findElement(By.id('data-protection-agree')).click()
  });

  it('All example queries should return HTTP status 200', async () => {
    let form = await driver.findElement(By.id('home-search-atlas-form'))

    let geneExamples = await form.findElements(By.css('a'))

    let queryURLs = []

    for(let gene of geneExamples) {
      let url = await gene.getAttribute('href')
      queryURLs.push(url)
    }

    for(let url of queryURLs) {
      console.log(`Fetching url ${url}`)
      const response = await fetch(url)
      expect(response.ok).toBe(true)
    }

  })
})
