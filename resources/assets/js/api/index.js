import axios from 'axios'

export function getTags (path, success, fail) {
  axios.get(`/api/${path}`)
    .then(function (response) {
      success(response.data)
    })
    .catch(function (error) {
      fail(error)
    })
}

export function search (payload, success, fail) {
  axios.post(`/api/${payload.path}`, payload.values)
    .then(function (response) {
      success(response.data)
    })
    .catch(function (error) {
      fail(error)
    })
}
