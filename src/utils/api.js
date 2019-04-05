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
  const res = await axios.get('api/solutions/');
  if (res.status !== 200) {
    throw new Error('获取题解列表失败');
  }
  return res.data;
}

export async function solutionDetailAPI(id) {
  const res = await axios.get(`api/solutions/${id}/`);
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
  const res = await axios.post('api/solutions/', data);
  if (res.status !== 201) {
    throw new Error(`创建题解失败`);
  }
  return res.data;
}

export async function templateListAPI(userId) {
  const res = await axios.get(`api/templates/?owner=${userId}`);
  if (res.status !== 200) {
    throw new Error(`获取模版列表失败`);
  }
  return res.data;
}

export async function templateDetailAPI(id) {
  const res = await axios.get(`api/templates/${id}/`);
  if (res.status !== 200) {
    throw new Error(`获取模版失败`);
  }
  return res.data;
}

export async function templateCreateAPI(title, intro, type, file) {
  const bodyFormData = new FormData();
  bodyFormData.set('title', title)
  bodyFormData.set('intro', intro)
  bodyFormData.set('type', type)
  bodyFormData.append(type, file)
  console.log(bodyFormData)
  const res = await axios.post(`api/templates/`, bodyFormData, {
    config: { headers: {'Content-Type': 'multipart/form-data' }}
  })
  if (res.status !== 201) {
    throw new Error(`创建模版失败`);
  }
  return res.data
}

export async function updateProfileAPI(name, type, sid, biography, avatar, level, id) {
  const bodyFormData = new FormData();
  bodyFormData.set('name', name)
  bodyFormData.set('type', type)
  bodyFormData.set('sid', sid)
  bodyFormData.set('biography', biography)
  bodyFormData.set('level', level)
  if (!isNil(avatar)) {
    bodyFormData.append('avatar', avatar)
  }
  console.log(bodyFormData)
  const res = await axios.patch(`api/profile/${id}/`, bodyFormData, {
    config: { headers: {'Content-Type': 'multipart/form-data' }}
  })
  if (res.status !== 200) {
    throw new Error(`更新用户失败`);
  }
  return res.data
}

export async function profileAPI(id) {
  const res = await axios.get(`api/profile/${id}/`)
  if (res.status !== 200) {
    throw new Error(`获取用户名片失败`);
  }
  return res.data;
}