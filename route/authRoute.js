const authRoute = require('express').Router()
const { signUp, login, logout, authToken, getUserInfo, generatePassLink, updatePassword } = require('../controller/authController')


authRoute.post(`/signup`, signUp)

authRoute.post(`/signin`, login)

authRoute.get(`/signout`, logout)

authRoute.get(`/signin/token`, authToken)

// current active login user info
authRoute.get(`/current/user`,auth, getUserInfo) 

// forgot password link
authRoute.post(`/forgot/password`, generatePassLink)

// update password link
authRoute.patch(`/update/password`, updatePassword)

module.exports = authRoute