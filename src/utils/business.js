/* eslint-disable no-console */
import { loginAPI } from "./api"
import { logger } from "handlebars";

export async function login(username, password) {
  const data = await loginAPI(username, password);
  const { token, user } = data;
  console.log(user)
  console.log(data)
  const { id, name} = user
  const isStaff = user.is_staff;
  localStorage.setItem('token', token);
  localStorage.setItem('isStaff', isStaff ? 'true' : 'false');
  localStorage.setItem('username', username);
  localStorage.setItem('id', id);
  localStorage.setItem('name', name);
  localStorage.setItem('isLogin', 'true');
}