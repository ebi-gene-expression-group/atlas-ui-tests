const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

beforeAll(done => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  done()
})

describe('Landing page', () => {
  // Open Expression Atlas in the browser before each test is run
  beforeEach(done => {
    // const chromeCapabilities = selenium.Capabilities.chrome()
    // chromeCapabilities.set('chromeOptions', {
    //   args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
    // });
    //
    // driver = new selenium.Builder()
    //   .withCapabilities(chromeCapabilities)
    //   .build();

    driver = new selenium.Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .headless()
          .windowSize({width: 640, height: 480})
          .addArguments("--no-sandbox")
        )
      .build()

    driver.get('https://www-test.ebi.ac.uk/gxa/').then(done)
  });

  // Close the website after each test is run (so that it is opened fresh each time)
  afterEach(done => {
    driver.quit().then(done)
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
    driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();

    driver.get('https://www-test.ebi.ac.uk/gxa/').then(done)
  });

  // Close the website after each test is run (so that it is opened fresh each time)
  afterEach(done => {
    driver.quit().then(done)
  });

  it('Loads About page', done => {
    testNavItems('About', '/about').then(done)
  })

  it('Loads Browse experiment page', done => {
    testNavItems('Browse experiments', '/experiments').then(done)
  })

  it('Loads Download page', done => {
    testNavItems('Download', '/download').then(done)
  })

  it('Loads Release notes page', done => {
    testNavItems('Release notes', '/release-notes').then(done)
  })

  it('Loads FAQ page', done => {
    testNavItems('FAQ', '/FAQ').then(done)
  })

  it('Loads Help page', done => {
    testNavItems('Help', '/help/index').then(done)
  })

  it('Loads Licence page', done => {
    testNavItems('Licence', '/licence').then(done)
  })

  const testNavItems = (text, expectedUrl) => {
    return driver.findElement(selenium.By.linkText(text)).click().then(() => {
      driver.getCurrentUrl().then(value => {
        expect(value).toContain(expectedUrl);
      })
    })
  }
})

