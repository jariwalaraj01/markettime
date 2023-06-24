import axios from "axios";

// error handler for all apis
const handleErrorResponse = (data) => {
  if (data?.code === 401) {
    window.localStorage.removeItem('token')
    window.location.reload()
  } else {
    return data
  }
}

// axios instance to initialize for particular api
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// attach token on every time to call this instance
instance.interceptors.request.use(function (config) {
  let token = localStorage.getItem('token');
  config.headers["Authorization"] = "Bearer " + token;
  return config;
});

// call post api only
export const POST = async (url, data) => {
  return await instance
    .post(url, data)
    .then(response => response.data)
    .catch(err => handleErrorResponse(err.response?.data))
}

// call get api only
export const GET = async (url) => {
  return await instance
    .get(url)
    .then(response => response.data)
    .catch(err => handleErrorResponse(err.response?.data))
}

// call put api only
export const PUT = async (url, data) => {
  return await instance
    .put(url, data)
    .then(response => response.data)
    .catch(err => handleErrorResponse(err.response?.data))
}
// call patch api only
export const PATCH = async (url, data) => {
  return await instance
    .patch(url, data)
    .then(response => response.data)
    .catch(err => handleErrorResponse(err.response?.data))
}
// call delete api only
export const DELETE = async (url, data = {}) => {
  return await instance
    .delete(url, data)
    .then(response => response.data)
    .catch(err => handleErrorResponse(err.response?.data))
}

export default instance