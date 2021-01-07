import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
const http = axios.create({
  baseURL: '/proxy/',
  timeout: 1000 * 180,
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // config.headers['token'] = Cookies.get('token') || ''''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data.errno === 401 || response.data.errno === 10001 ||
    response.data.data === '登陆信息已过期,请重新登陆!' ||
    response.data.data === 'JWT不存在请登录!' ||
    response.data.data === '令牌不存在请登录!') {
  }
  return response.data.data
}, error => {
  // console.log('api error:' + error.response)
  // if (error.response.status === 503) {
  //   Message.error('服务不可用')
  //   return Promise.reject(error)
  // } if (error.response.status === 401) {
  //   Message.warning('登录已失效,将重新登录')
  //   clearLoginInfo()
  //   return Promise.reject(error)
  // } else {
  //   Message.warning('系统繁忙')
  // }
  return Promise.reject({msg:'系统繁忙'})
})

export default http
