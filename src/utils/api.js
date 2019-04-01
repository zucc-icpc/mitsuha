import axios from "axios";

const devMode = process.env.NODE_ENV === 'development'
const baseUrl = 'http://localhost:8000'
const protocol = devMode ? 'http' : 'https'

axios.defaults.baseURL = baseUrl
axios.defaults.withCredentials = true

export async function loginAPI(username, password) {
  const res = await axios.post('api-token-auth/', {username, password});
  if (res.status !== 200) {
    throw new Error('登录失败');
  }
  return res.data;
}

export async function registerAPI(username, password, email) {
  const res = await axios.post('api/user/', {username, password, email});
  if (res.status !== 200) {
    throw new Error('注册失败');
  }
  return res.data;
}

export async function solutionListAPI() {
  const res = await axios.get('api/solution/');
  if (res.status !== 200) {
    throw new Error('获取题解列表失败');
  }
  return res.data;
}

export async function solutionDetailAPI(id) {
  const res = await axios.get(`api/solution/${id}/`);
  if (res.status !== 200) {
    throw new Error(`获取题解${id}失败`);
  }
  return res.data;
}

export async function solutionCreateAPI(title, oj, pid, content) {
  const data = {
    title,
    oj,
    pid,
    content,
  };
  const res = await axios.post('api/solution/', data);
  if (res.status !== 201) {
    throw new Error(`创建题解失败`);
  }
  return res.data;
}