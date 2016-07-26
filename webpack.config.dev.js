var autoprefixer     = require('autoprefixer');
var path             = require('path');
var webpack          = require('webpack');
var NpmInstallPlugin = require('npm-install-webpack-plugin');


module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new NpmInstallPlugin({
      dev: false,
      peerDependencies: true,
    }),
    new webpack.IgnorePlugin(/^(buffertools)$/), // unwanted "deeper" dependency
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      config: path.join(__dirname, 'src', 'config', 'development')
    }
  },
  node: {
    fs: "empty"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test:   /\.css$/,
      loader: "style-loader!css-loader!postcss-loader",
      include: path.join(__dirname, 'node_modules')
    },
    {
      test:   /\.css$/,
      loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader',
      include: path.join(__dirname, 'src')
    },
    {
      test:   /\.json$/,
      loader: "json-loader"
    }
  ]
  },
  postcss: function () {
    return [ autoprefixer ];
  }
};
