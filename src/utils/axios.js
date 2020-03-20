import axios from "axios"
import store from "@/store"

const service = axios.create({
  baseURL: process.env.VUE_AXIOS_BASEURL,
  timeout: 30 * 1000
})

service.interceptors.request.use(
  (config) => {
    const token = store.state.token
    if (token) {
      config.headers.token = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      if (res.errMessage) {
        console.log(res.errMessage)
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    const status = error.response.status
    console.log(error.response, status)
    return Promise.reject(error)
  }
)

// export function get(url, params = {}) {
//   return new Promise((resolve, reject) => {
//     service.get(
//       url, {
//         params
//       }
//     ).then(res =>
//       resolve(res.data)
//     ).catch(err => reject(err))
//   })
// }

// export function post(url, params = {}) {
//   return new Promise((resolve, reject) => {
//     service.post(url, params).then(res => resolve(res.data)).catch(err => reject(err))
//   })
// }

// export function formDataPost(url, params = {}) {
//   return new Promise((resolve, reject) => {
//     service.post(url, params, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then(res => resolve(res)).catch(err => reject(err))
//   })
// }

export default service
