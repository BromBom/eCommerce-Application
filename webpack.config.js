const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

const baseConfig = {
  entry: {
    main: path.resolve(__dirname, './src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      favicon: path.join(__dirname, 'src', 'favicon.png'),
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/img'),
          to: path.resolve(__dirname, 'dist/img'),
        },
      ],
    }),
    new EslintPlugin({ extensions: ['ts'] }),
  ],
  resolve: {
    alias: {
      img: path.join(__dirname, 'src', 'assets', 'img'),
    },
    extensions: ['.ts', '.js'],
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
};

module.exports = ({}, { mode }) => {
  const isProductionMode = mode === 'production';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
