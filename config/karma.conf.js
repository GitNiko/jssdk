module.exports = function(config){
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath : '../',
    // frameworks to use
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files : [
      'www/lib/angular/angular.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/lib/angular-animate/angular-animate.js',
      'www/lib/angular-resource/angular-resource.js',
      'www/lib/angular-cookies/angular-cookies.js',
      'www/lib/angular-sanitize/angular-sanitize.js',
      'www/lib/angular-ui-router/release/angular-ui-router.js',
      'www/lib/ionic/js/ionic.js',
      'www/lib/ionic/js/ionic-angular.js',
      'www/js/controller/**/*.js',
      'www/js/directive/*.js',
      'www/js/service/*.js',
      'tests/unit/**/*.js'
      //'template/activity/*.html'
    ],
    // list of files to exclude
      exclude: [
      ],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    //reporters: ['progress', 'junit', 'coverage'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      //'src/**/*.js': ['coverage'],
      'template/activity/*.html': ['ng-html2js']
    },
    // web server port
    port: 9876,
     // enable / disable colors in the output (reporters and logs)
     colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
     // enable / disable watching file and executing tests whenever any file changes
     autoWatch: true,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: [ 'Chrome' ],
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,
    junitReporter :  {
      outputFile: 'testout/test-results.xml',
      suite: ''
    },
    coverageReporter: {
      type : 'html',
      dir : 'testout/coverage/'
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'foo'
    }
  });
};
