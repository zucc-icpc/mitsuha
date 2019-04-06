/* eslint-disable no-console */
import { loginAPI, verifyUserAPI, getUserAPI } from "./api"
import { logger } from "handlebars";
import { store } from "../index.js"
import { updateUser } from "../store/actions";

export async function login(username, password) {
  const data = await loginAPI(username, password);
  const { token, user } = data;
  console.log(user)
  console.log(data)
  const { id, name, avatar, type } = user
  const isStaff = user.is_staff;
  const payload = {
    id,
    name,
    username,
    avatar,
    type,
    isStaff,
    isLogin: true,
  }
  store.dispatch(updateUser(payload))
}

export async function verifyUser() {
  const data = await verifyUserAPI()
  if (data.isLogin === 'false') {
    store.dispatch(updateUser({isLogin: false}))
    return {
      isLogin: false
    }
  }
  const userInfo = await getUserAPI(data.id)
  const {id, username, is_staff, type, avatar, name} = userInfo
  const payload = {
    id,
    name,
    username,
    avatar,
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