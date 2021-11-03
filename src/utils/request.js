import axios from 'axios'
import JSONbig from 'json-bigint'
// 非组件模块可以这样加载使用 element 的 message 提示组件
import { Message } from 'element-plus'
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  // baseURL: 'http://ttapi.research.itcast.cn/mp/',
  // 可以用来定制后端返回的原始数据处理
  // 参数data就是后端返回的原始数据（未经处理的Json格式字符串）
  // 后端返回的可能不是JSON格式字符串，如果不是的话使用JSON.big会报错，因此采用try catch来捕获异常
  transformResponse: [function (data) {
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
      // 参数err可以不用它，但是必须写上
    } catch (err) {
      // 如果转换失败，则进入这里，把原始数据原封不动的返回
      return data
    }
    // axios默认在内部使用JSON.parse来将原始数据转化成js对象，因为js处理的数字的范围超出，因此不能正确转换
  }]
})
// 请求拦截器
request.interceptors.request.use(
  function (config) {
  // Do something before request is sent所有（任何）请求会经过这里
    // console.log(config)
  // config是请求相关的配置信息对象 需要手动地在config里添加token信息
  // return之后 请求才会真正地发出去 如果没有return，请求就会被拦截
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
  // Do something with request error如果请求失败，会经过这里
    return Promise.reject(error)
  })

  // 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  // 任何超出 2xx 的响应码都会进入这里
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }

  return Promise.reject(error)
})

export default request
