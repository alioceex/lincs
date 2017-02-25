var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: {
    app: './resources/assets/js/main.js',
    vendor: ['vue', 'vue-router', 'vuex-router-sync', 'vuex', 'axios']
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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  ]

};

if(process.env.NODE_ENV === 'production'){
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourcemap: true,
      compress: {
        warnings: false
      }
    })
  );

  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    })
  );
}