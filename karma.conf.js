module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'chai',
      'sinon',
      'karma-typescript',
    ],

    // list of files / patterns to load in the browser
    files: [
      'ash/**/*.ts',
      'tests/**/*.ts',
    ],

    // list of files to exclude
    exclude: [
      'ash/io/**/*',
      'tests/io/**/*',
    ],

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/**/*.ts': ['karma-typescript'],
      'ash/**/*.ts': ['karma-typescript', 'sourcemap', 'coverage'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'mocha',
      'karma-typescript',
      'coverage',
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'ChromeHeadless',
      'FirefoxHeadless'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage'),
      require('karma-sourcemap-loader'),
    ],

    coverageReporter: {
      type: 'in-memory'
    },

    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: [
          /\.(d|spec)\.ts$/i,
          /.*node_modules.*/
        ]
      },
      tsconfig: 'tests/tsconfig.json',
      bundlerOptions: {
        resolve: {
          directories: [
            'node_modules',
            'ash',
          ],
          alias: {
            'ash-ts': 'ash',
          }
        }
      },
      entrypoints: /\.spec\.ts$/,
      reports: {
        html: {
          directory: 'reports',
          subdirectory: browser => browser.name.toLowerCase().split(' ')[0].replace(/headless/, ''),
        },
        'text-summary': '',
      },
    },

  });
};
