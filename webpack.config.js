var path = require('path');
var webpack = require('webpack');
var inPro = (process.env.NODE_ENV === 'production');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    app: [
      './resources/assets/js/main.js',
      './resources/assets/sass/main.sass',
    ],
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
      },
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({
      minimize: inPro
    })
  ]

};

if(inPro){
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