const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.31.73:80', // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
}
