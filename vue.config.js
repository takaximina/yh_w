module.exports={
    configureWebpack:{
        externals: {
         //包名 ： 全局变量
         'echarts': 'echarts'
        }
      },
      devServer: {
        port: 8001,
        disableHostCheck: true,
        overlay: {
          errors: true,
          warnings: true
        },
        proxy: {
          "/proxy":{
            target: 'http://127.0.0.1:8360',
            changeOrigin: true,
            pathRewrite: { '^/proxy': '' }
          }
        }
      }
}