const {
  SkeletonPlugin
} = require('page-skeleton-webpack-plugin')
const path = require('path')
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  // webpack 相关配置
  configureWebpack: {
    plugins: [
      new SkeletonPlugin({
        pathname: path.resolve(__dirname, './shell'), // the path to store shell file
        staticDir: path.resolve(__dirname, './dist'), // the same as the `output.path`
        routes: ['/', '/about'] // Which routes you want to generate skeleton screen
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  },
  devServer: {
    proxy: ""
  }
}
