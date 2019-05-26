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
const baseUrl = devMode ? 'http://localhost:8000' : 'http://47.100.57.37:8000'
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

export async function getUserAPI(id) {
  const res = await axios.get(`api/user/${id}/`);
  if (res.status !== 200) {
    throw new Error('获取用户');
  }
  return res.data;
}

export async function solutionListAPI(page, filtered, sorted) {
  let params = {}
  if (!isNil(filtered)) {
    filtered.forEach(item => {
      params[item.id] = item.value
    })
  }
  if (!isNil(sorted) && sorted.length > 0) {
    const id = sorted[0].id
    params['ordering'] = sorted[0].desc ? `-${id}` : id
  }
  const res = await axios.get(`api/solutions/?page=${page}`, {
    params
  });
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

export async function solutionUpdateAPI(id, content) {
  const data = {
    content,
  };
  const res = await axios.patch(`api/solutions/${id}/`, data);
  if (res.status !== 200) {
    throw new Error(`更新题解失败`);
  }
  return res.data;
}

export async function solutionDeleteAPI(id) {
  console.log('delete', id)
  const res = await axios.delete(`api/solutions/${id}/`);
  if (res.status !== 204) {
    throw new Error(`删除题解失败`);
  }
  return res.data;
}

export async function templateListAPI() {
  const res = await axios.get(`api/templates/`);
  if (res.status !== 200) {
    throw new Error(`获取模版列表失败`);
  }
  return res.data;
}

export async function templateListByUserIdAPI(userId) {
  const res = await axios.get(`api/templates/?owner=${userId}`);
  // const res = await axios.get(`api/templates/`);
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

export async function templateDeleteAPI(id) {
  const res = await axios.delete(`api/templates/${id}/`);
  if (res.status !== 204) {
    throw new Error(`删除模版失败`);
  }
  return res.data;
}

export async function updateProfileAPI(payload) {
  const bodyFormData = new FormData();
  const keys = Object.keys(payload)
  keys.forEach(key => {
    const val = payload[key]
    if (!isNil(val) && key !== 'avatar' && key !== 'id') {
      bodyFormData.set([key], val)
    }
  })
  const avatar = payload.avatar
  const id = payload.id
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


export async function updateAvaterAPI(id, avatar) {
  const bodyFormData = new FormData();
  if (!isNil(avatar)) {
    bodyFormData.append('avatar', avatar)
  }
  console.log(bodyFormData)
  const res = await axios.patch(`api/profile/${id}/`, bodyFormData, {
    config: { headers: {'Content-Type': 'multipart/form-data' }}
  })
  if (res.status !== 200) {
    throw new Error(`更新用户头像失败`);
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

export async function memberListAPI(id) {
  const res = await axios.get(`api/profile/?type=队员`)
  if (res.status !== 200) {
    throw new Error(`获取队员失败`);
  }
  return res.data;
}

export async function verifyUserAPI() {
  const res = await axios.get(`api/verify_user/`)
  if (res.status !== 200) {
    throw new Error(`验证用户失败`);
  }
  return res.data;
}

export async function clearCookieAPI() {
  const res = await axios.post(`clear-token/`)
  if (res.status !== 200) {
    throw new Error(`设置cookie过期失败`);
  }
  return res.data;
}

export async function honorListAPI() {
  const res = await axios.get('api/honors/')
  if (res.status !== 200) {
    throw new Error(`获取故事失败`);
  }
  return res.data;
}