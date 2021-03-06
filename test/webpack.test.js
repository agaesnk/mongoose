'use strict';

const assert = require('assert');
const rimraf = require('rimraf');
const utils = require('../lib/utils');
const semver = require('semver');

describe('webpack', function() {
  it('works for browser build', function(done) {
    // Below is the Webpack config Mongoose uses for testing
    // acquit:ignore:start
    // Webpack doesn't work on Node.js 4.x or 5.x, and very slow on
    // Travis with 6.x and 7.x.
    if (!semver.satisfies(process.version, '>=8.0.0')) {
      this.skip();
    }
    const webpack = require('webpack');
    this.timeout(45000);
    // acquit:ignore:end
    const config = {
      entry: ['./test/files/sample.js'],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/i,
            loader: 'babel-loader'
          }
        ]
      },
      node: {
        // Replace these Node.js native modules with empty objects, Mongoose's
        // browser library does not use them.
        // See https://webpack.js.org/configuration/node/
        dns: 'empty',
        fs: 'empty',
        'module': 'empty',
        net: 'empty',
        tls: 'empty'
      },
      target: 'web'
    };
    // acquit:ignore:start
    webpack(config, utils.tick(function(error, stats) {
      assert.ifError(error);
      assert.deepEqual(stats.compilation.errors, []);
      done();
    }));
    // acquit:ignore:end
  });

  after(function(done) {
    rimraf('./dist', done);
  });
});
