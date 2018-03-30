const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'app', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'dist', 'app'),
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.join(__dirname, 'src', 'app')],
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: path.join(__dirname, 'awesome-tsconfig.json')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'app', 'index.html')
    })
  ]
};
