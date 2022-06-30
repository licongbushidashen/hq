import axios from 'axios'
import store from '../store'
import { Message, MessageBox } from 'element-ui'
// 参数过滤函数
function filterNull(o) {
  if (typeof o !== 'string') {
    for (var key in o) {
      if (o[key] === null) {
        delete o[key]
      }
      if (toType(o[key]) === 'string') {
        o[key] = o[key].trim()
      } else if (toType(o[key]) === 'object') {
        o[key] = filterNull(o[key])
      } else if (toType(o[key]) === 'array') {
        o[key] = filterNull(o[key])
      }
    }
  }
  return o
}
// 自定义判断元素类型JS
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

function apiAxios(
  method,
  url,
  params,
  header = {
    'content-Type': 'application/json; charset=utf-8'
  }
) {
  if (params) {
    params = filterNull(params)
  }
  sessionStorage.getItem('vue_token')
    ? (header.Authorization = 'Bearer ' + sessionStorage.getItem('vue_token'))
    : ''
  return new Promise((resolve, reject) => {
    var data
    if (method == 'PUT') {
      var id = params.id
      delete params.id
      data = params
      params = {
        id: id
      }
    } else {
      var data = method === 'POST' || method === 'PUT' ? params : null
      params = method === 'GET' || method === 'DELETE' ? params : null
    }
    axios({
      method: method,
      headers: header,
      url: url,
      data: data,
      params: params,
      withCredentials: false,
      timeout: 60000
    })
      .then(function(res) {
        if (res.status == 200 || res.status == 204) {
          resolve(res.data)
        } else if (res.status == 401) {
          sessionStorage.setItem('vue_token', '')
          store.state.vuex_token = ''
          window.reload()
        } else {
          console.log(res)
        }
      })
      .catch(function(err) {
        const errs = JSON.parse(JSON.stringify(err))
        if (errs.response.status == 401) {
          sessionStorage.setItem('vue_token', '')
          store.state.vuex_token = ''
          window.reload()
        } else if (errs.response.status == 400) {
          if (errs.response.data.error == 'invalid_grant') {
            Message({
              message: '账号或密码错误',
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
        reject(err)
      })
  })
}
export default {
  get: function(url, params, headers) {
    return apiAxios('GET', url, params, headers)
  },
  post: function(url, params, headers) {
    return apiAxios('POST', url, params, headers)
  },
  put: function(url, params, headers) {
    return apiAxios('PUT', url, params, headers)
  },
  delete: function(url, params, headers) {
    return apiAxios('DELETE', url, params, headers)
  }
}
