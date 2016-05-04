# Stocka — Stock symbol lookup

**Stocka** is a web application built on [AngularJS](https://angularjs.org/) and [D3](https://d3js.org/) technology that  provides a way to lookup and download stock information into CSV files automatically . You can use it to quickly find out the summary, calls, or puts of a single stock or multiple of them. The app focuses on stock options such as: Previous Close, Open, Bid, Ask, 1-year Target Estimate, Beta Constant, Earnings Date, Day’s Range, 52-week Range, Volume, Average Volume (3 months), Market Cap, P/E, EPS, Dividend & Yield, etc.

The application contains all needed dependencies and is preconfigured to install the [Angular](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/) frameworks and a bunch of development as well as testing tools for instant web development gratification.

References of stock options can be found from the following destinations: [Yahoo Finance](http://finance.yahoo.com/), [Google Finance](https://www.google.com/finance)

### Screenshots
![stocka-1](http://i1175.photobucket.com/albums/r629/bminhz/Screen%20Shot%202016-05-04%20at%201.44.29%20AM_zpsdzorpkav.png)

## Getting Started

To get you started you can simply clone the `stocka` repository and install the dependencies:

### Prerequisites

You need Git to clone the `stocka` repository. You can get Git from
[here](http://git-scm.com/).

We also use a number of **Node.js** tools to initialize and test `stocka`. You must have Node.js and
its package manager (npm) installed.  You can get them from [here](http://nodejs.org/).

### Clone ``stocka``

Clone the `stocka` repository using [git][git]:

```
git clone https://github.com/tachymetre/stocka.git
cd stocka
```

If you just want to start a new project without the angular-seed commit history then you can do:

```bash
git clone --depth=1 https://github.com/tachymetre/stocka.git <your-project-name>
```

The `depth=1` tells git to only pull down one commit worth of historical data.

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `bower_components` - contains the angular framework files

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/app/index.html`.

## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The stocka project comes preconfigured with a local development webserver.  It is a Node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via xhr or other means, you need to figure
out what is the best way to host the static files to comply with the same origin policy if
applicable. Usually this is done by hosting the files by the backend server or through
reverse-proxying the backend server(s) and webserver(s).

## Directory Layout

```
stocka/
  |  app/                                       --> all of the source files for the application
  |  |   scripts/
  |  |   |   controllers/
  |  |   |   |   stockController.js
  |  |   |   directives/
  |  |   |   |   visualizeStockData.js
  |  |   |   services/
  |  |   |   |   d3.js                
  |  |   |   |   getStockInfo.js
  |  |   templates/
  |  |   |   stock.html
  |  |   app.css                                --> default stylesheet
  |  |   app.js                                 --> main application module
  |  |   index.html                             --> app layout file (the main html template file of the app)
  |  e2e-tests/                                 --> end-to-end tests
  |	 |	 protractor.conf.js                     --> Protractor config file
  |  |   scenarios.js                           --> end-to-end scenarios to be run by Protractor
  |  .bowerrc
  |  .gitignore
  |  .jshintrc
  |  .travis.yml
  |  bower.json
  |  karma.conf.js
  |  LICENSE
  |  package.json
  |  README.md
```

## Testing

There are two kinds of tests in the **stocka** application: Unit tests and End to End tests.

### Running Unit Tests

The stocka app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The stocka app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Updating Angular

Previously we recommended that you merge in changes to stocka into your own fork of the project. Now that the angular framework library code and tools are acquired through package managers ([npm][npm]) and [bower][bower]) you can use these tools instead to update the dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.

## Version
1.0.0

## License

**Stocka** is written and maintained by [Minh Pham](https://github.com/tachymetre), and is licensed under [MIT](https://opensource.org/licenses/MIT).

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server