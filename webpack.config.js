const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'public/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      /*
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      } */
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['public/dist'])
    // new UglifyJSPlugin()
  ]
}
