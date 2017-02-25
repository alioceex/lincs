var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: {
    app: './resources/assets/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    publicPath: './public'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.vue'],
    alias: {
        'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    loaders: [
        { test: /\.vue$/, loader: "vue-loader" }
    ]
  }

};