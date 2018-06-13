# UI tests for Expression Atlas [![Build Status](https://travis-ci.org/ebi-gene-expression-group/atlas-ui-tests.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/atlas-ui-tests)

This repository contains Selenium test suites for pages in the Expression Atlas testing environment ([www-test.ebi.ac.uk/gxa](www-test.ebi.ac.uk/gxa)).

## Running locally

### Requirements

- Node.js & npm
- Chrome web browser
- [Chrome WebDriver](http://chromedriver.chromium.org/downloads)

Note: Chrome WebDriver **must be added to the `PATH` variable**. For example, you can add this line to your `.bash_profile`:

```
export PATH=$PATH:<path_to_webdriver_here>
```

### Install dependencies

To install the dependencies defined in `package.json`:

```
npm install
```

### Run tests

#### Running all tests
To run the full suite of tests:

```
npm test
```

#### Running a specific test file
If you want to run a specific test file, you can use the following command:

```
npx jasmine <path_to_test_file>
```

#### Running tests in IntelliJ IDEA

You can run the tests directly in your IDE by installing the [Jasmine plugin](https://plugins.jetbrains.com/plugin/10449-jasmine).
