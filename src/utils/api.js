import axios from "axios";
import toastr from "toastr";
import { isNil } from "lodash";

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

const devMode = process.env.NODE_ENV === 'development'
const baseUrl = 'http://localhost:8000'
const protocol = devMode ? 'http' : 'https'

axios.defaults.baseURL = baseUrl
axios.defaults.withCredentials = true
axios.defaults.timeout = 10000
axios.interceptors.request.use(config=> {
  return config;
}, err=> {
  toastr.error({message: '请求超时!'});
  return Promise.resolve(err);
})
axios.interceptors.response.use((res) => {
  return res
}, async (error) => {
  if (error.response.status === 401) {
    toastr.error('您已经登出，刷新后请重新进行登录操作')
  } else if (error.response.status === 403) {
    toastr.error('您无权进行此操作')
  } else if (error.response.status === 500) {
    toastr.error('服务器内部错误')
  } else if (error.response.status === 502) {
    toastr.error('网络不稳定，请稍后再试')
  }
  return Promise.reject(error)
})

export async function loginAPI(username, password) {
    const res = await axios.post('api-token-auth/', {username, password});
    if (!isNil(res.data.error)) {
      toastr.warning("账号或密码错误");
      throw new Error('账号或密码错误');
    }
    return res.data;
}

export async function registerAPI(username, password, email) {
  const res = await axios.post('api/user/', {username, password, email});
  if (!isNil(res.data.error)) {
    if (res.data.error.username) {
      toastr.warning(res.data.error.username);
    }
    if (res.data.error.email) {
      toastr.warning(res.data.error.email);
    }
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