module.exports={
    configureWebpack:{
        externals: {
         //包名 ： 全局变量
         'echarts': 'echarts'
        }
      },
      productionSourceMap: false,
      devServer: {
        port: 8001,
        disableHostCheck: true,
        overlay: {
          errors: true,
          warnings: true
        },
        proxy: {
          "/proxy":{
            target: 'http://172.16.255.21:9292/proxy',
            changeOrigin: true,
            pathRewrite: { '^/proxy': '' }
          }
        }
      }
}