// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://music.163.com/',
        changeOrigin: true,            //是否跨域，true为允许跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  }
}