import {Router, request, response} from "express"
import multer from 'multer'
import multerConfig from './config/multer'

import authMiddlewares from './app/middlewares/auth'
import UserController from "./app/controllers/UserController"
import Sessioncontroller from './app/controllers/SessionController'
import ProductController from "./app/controllers/ProductController"
import CategoryController from "./app/controllers/CategoryController"




const routes =  new Router()

const upload = multer(multerConfig)

routes.post('/users', UserController.store )

routes.post('/sessions', Sessioncontroller.store )

routes.use(authMiddlewares)// será chamdo por todas as rotas abaixo

routes.post('/products', upload.single('file'), ProductController.store )
routes.get('/products', ProductController.index)

routes.post('/categories',CategoryController.store )
routes.get('/categories', CategoryController.index)





export default routes