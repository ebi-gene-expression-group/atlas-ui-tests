const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const getWebdriver = () => {
  return new selenium.Builder()
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
  jest.setTimeout(30000); // 30 seconds
  driver = getWebdriver()
})

afterAll(() => {
  driver.quit()
})

describe('Landing page', () => {
  // Open Expression Atlas in the browser before each test is run
  beforeEach(done => {
    driver.get('https://www-test.ebi.ac.uk/gxa/').then(done)
  });

  it('Should be on the home page', done => {
    driver.getCurrentUrl().then(value => {
      expect(value).toContain('/home')

      done()
    });
  });
})

describe('Expression Atlas navigation bar', () => {
  // Open Expression Atlas in the browser before each test is run
  beforeEach(done => {
    driver.get('https://www-test.ebi.ac.uk/gxa/').then(done)
  })

  it('Loads About page', () => {
    return testNavItems('About', '/about')

  })

  it('Loads Browse experiment page', () => {
    return testNavItems('Browse experiments', '/experiments')
  })

  it('Loads Download page', () => {
    return testNavItems('Download', '/download')
  })

  it('Loads Release notes page', () => {
    return testNavItems('Release notes', '/release-notes')
  })

  it('Loads FAQ page', () => {
    return testNavItems('FAQ', '/FAQ')
  })

  it('Loads Help page', () => {
    return testNavItems('Help', '/help/index')
  })

  it('Loads Licence page', () => {
    return testNavItems('Licence', '/licence')
  })

  const testNavItems = (text, expectedUrl) => {
    return driver.findElement(selenium.By.linkText(text)).click().then(() => {
      driver.getCurrentUrl().then(value => {
        expect(value).toContain(expectedUrl)
      })
    })
  }
})

