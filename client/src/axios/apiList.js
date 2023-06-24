// eslint-disable-next-line 
import { POST, GET, PUT, DELETE, PATCH } from "./configure"

// login api
export const loginAPI = async (data) => {
  const { email, password } = data
  const response = await POST(`/user/login`, { email, password })
  return response
}
// check user is authenticate via OTP
export const verifyOtpAPI = async (data) => {
  const { email, otp } = data
  const response = await POST(`/user/verify-otp`, { email, otp })
  return response
}
// call signup or register api
export const signupAPI = async (data) => {
  const {
    first_name,
    last_name,
    location,
    department,
    email,
    password,
    confirm_password,
  } = data
  const apiData = {
    first_name,
    last_name,
    location,
    department,
    email,
    password,
    confirm_password,
  }
  const response = await POST(`/user/signup`, apiData)
  return response
}
// fetch user details for home page
export const userDetailAPI = async () => {
  const response = await GET(`/user`)
  return response
}
// logout api
export const logoutAPI = async () => {
  const response = await GET(`/user/logout`)
  return response
}
