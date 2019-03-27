const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './lib/client/index.html',
  filename: 'index.html',
  inject: 'body'
})
let config = {
  entry: [path.resolve(__dirname,'./lib/client/index.js')],
  output: {
    path: path.resolve(__dirname,'./lib/build'),
    filename: 'index_bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      img: path.resolve(__dirname,'./lib/client/img')
    }
  },
  externals: {
    electron: "require('electron')"
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, 
        use: [
            {loader:'style-loader'},
            {loader: 'css-loader', options: {modules: true, localIdentName: '[name]__[local]___[hash:base64:5]', sourceMap: true}},
            {loader: 'sass-loader', options: {/*sourceMap: true*/}}
          ]
      },
      { test: /\.css$/, 
        use: [
            {loader:'style-loader'},
            {loader: 'css-loader', options: {modules: true, localIdentName: '[name]__[local]___[hash:base64:5]', sourceMap: true}}
        ]
      },
      {
        test: /\.(woff|png|gif|svg)$/,
        loader: 'url-loader',
      }
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
}
module.exports = config
