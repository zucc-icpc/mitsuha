import axios from "axios";

const devMode = process.env.NODE_ENV === 'development'
const baseUrl = 'http://localhost:8000'
const protocol = devMode ? 'http' : 'https'

axios.defaults.baseURL = baseUrl
axios.defaults.withCredentials = true

export async function loginAPI(username, password) {
  const res = await axios.post('api-token-auth/', {username, password})
  if (res.status !== 200) {
    throw new Error('登录失败')
  }
  return res.data
}

export async function registerAPI(username, password, email) {
  const res = await axios.post('api/user/', {username, password, email})
  if (res.status !== 200) {
    throw new Error('注册失败')
  }
  return res.data
}