"use strict"
const path = require("path")
const utils = require("./utils")
const config = require("../config")
const webpack = require("webpack")
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanCSS = require('clean-css');
const Uglify = require("uglify-es");
const devMode = process.env.NODE_ENV === 'development';

function resolve(dir) {
  return path.join(__dirname, "..", dir)
}

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    corejs: "./src/js/common/shim.js",
    index: "./src/js/index.js",
    about: "./src/js/about.js"
  },
  output: {
    path: config.build.assetsRoot,
    filename: "[name].bundle.js",
    publicPath: devMode ? config.dev.assetsPublicPath : config.build.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: "babel-loader",
        use: ['happypack/loader'],
        include: [
          resolve("src")
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        include: [resolve("src/icons")],
        options: {
          symbolId: "icon-[name]"
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        exclude: [resolve("src/icons")],
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', "postcss-loader"]
      },
      {
        test: /\.(sa|sc)ss$/,
        exclude: [resolve("src/lib")],
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        include: [
          resolve("src")
        ],
        use: [
          {
            loader: 'html-loader',
            // 注释掉，与html-webpack-plugin的minify冲突了
            // options: {
            //   minimize: true
            // }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({

    }),
    new HappyPack({
      loaders: ['babel-loader'],
      threads: 4
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new CopyWebpackPlugin([
      {
        from: resolve("static"),
        to: devMode ? config.dev.assetsSubDirectory : config.build.assetsSubDirectory
      }
    ])
  ],
  node: {
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
}
