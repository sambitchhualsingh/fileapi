const categoryRoute = require('express').Router()
const { readAll , readSingle, create, update, deleteCategory } = require('../controller/cateroryController')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminMiddleware')

categoryRoute.get(`/all`, auth, adminAuth, readAll) // to rad all category
categoryRoute.get(`/single/:id`, auth, adminAuth, readSingle)  // to rad single category  

categoryRoute.get(`/add`, auth, adminAuth, create)    // create new category

categoryRoute.get(`/update/:id`, auth, adminAuth, update) // update existing category

categoryRoute.get(`/delete/:id`, auth, adminAuth, deleteCategory)  // remove existing category


module.exports = categoryRoute
