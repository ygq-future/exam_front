const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.41.139:80',
        // target: 'https://47.101.63.12/exam_api', // 代理目标的基础路径
        target: 'http://localhost:8989', // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
}
