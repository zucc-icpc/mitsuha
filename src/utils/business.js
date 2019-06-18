/* eslint-disable no-console */
import { loginAPI, verifyUserAPI, getUserAPI, profileAPI } from "./api"
import { store } from "../index.js"
import { updateUser } from "../store/actions";
import { isNil } from "lodash";
import * as Cookies from 'js-cookie'

export async function login(username, password) {
  const data = await loginAPI(username, password);
  const { token, user } = data;
  console.log(user)
  console.log(data)
  const { id, name, avatar, type, avatar_thumb } = user
  const isStaff = user.is_staff;
  const payload = {
    id,
    name,
    username,
    avatar,
    avatar_thumb,
    type,
    isStaff,
    isLogin: true,
  }
  store.dispatch(updateUser(payload))
}

export function logout() {
  const cookies = Cookies.get()
  console.log(cookies)
  Object.keys(cookies).forEach(name => {
    Cookies.remove(name)
  }) 
  const payload = {
    isLogin: false,
  }
  store.dispatch(updateUser(payload))
}

/**
 * 验证用户的token是否合法
 * 如果合法更新redux中的用户信息，并返回一个对象，其中isLogin为true
 * 否则返回一个对象，其中isLogin为false
 */
export async function verifyUser() {
  let data
  try {
    data = await verifyUserAPI()
    if (data.isLogin === 'false') {
      store.dispatch(updateUser({isLogin: false}))
      return {
        isLogin: false
      }
    }
  } catch (e) {
    store.dispatch(updateUser({isLogin: false}))
    return {
      isLogin: false
    }
  }
  const userInfo = await profileAPI(data.id)
  const {id, username, is_staff, type, avatar, name, avatar_thumb} = userInfo
  const payload = {
    id,
    name,
    username,
    avatar,
    avatar_thumb,
    type,
    isStaff: is_staff,
    isLogin: true,
  }
  store.dispatch(updateUser(payload))
  return {
    is: id,
    isLogin: true,
  }
}