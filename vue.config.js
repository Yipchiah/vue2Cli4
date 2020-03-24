module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'vue2-cli4-demo'
      return args
    })
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
