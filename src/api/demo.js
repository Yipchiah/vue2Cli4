import axios from "@/utils/axios"

export function getList(data) {
  return axios({
    url: 'api/XXXX',
    method: 'get',
    params: data
  })
}

export function upload(data) {
  return axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: 'api/XXX',
    method: 'post',
    data
  })
}
