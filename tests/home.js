const selenium = require('selenium-webdriver');

beforeAll(done => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  done()
})

describe('Landing page', () => {
  // Open Expression Atlas in the browser before each test is run
  beforeEach(done => {
    driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();

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

