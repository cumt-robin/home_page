'use strict'
const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const devMode = process.env.NODE_ENV === 'development';

function joinPath(dir) {
  return path.join(__dirname, '..', dir)
}

function assetsPath(_path) {
  const assetsSubDirectory = devMode ? config.dev.assetsSubDirectory: config.build.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

function getMultiEntrys() {
  
}

function getHtmlWebpackPluginInstance(pageName, title, minify = false) {
  return {
    filename: `${pageName}.html`,
    template: `src/${pageName}.html`,
    favicon: joinPath('favicon.ico'),
    title: title || 'Tusi博客的个人主页',
    chunks: ['manifest', 'shim', 'vendors', pageName],
    minify: minify ? {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    } : {}
  }
}

function createNotifierCallback() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.joinPath = joinPath;

exports.assetsPath = assetsPath;

exports.getHtmlWebpackPluginInstance = getHtmlWebpackPluginInstance

exports.createNotifierCallback = createNotifierCallback
