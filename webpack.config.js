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
        test: /\.css$/,
        include: [
          path.join(__dirname, 'src', 'app'),
          path.join(__dirname, 'node_modules', 'react-toolbox')
        ],
        loader: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } }
        ]
      },
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
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist', 'app')
  },
  mode: 'development'
};
