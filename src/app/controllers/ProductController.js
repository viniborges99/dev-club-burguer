import * as Yup from 'yup'
import User from "../models/User"
import Product from '../models/Product'
import { response } from 'express'


class ProductsController{
    async store(request, response){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
        })
        

        try {
            await schema.validateSync(request.body, {abortEarly: false})
        } catch (err) {
            return response.status(400).json({error: err.errors })
        }

        const {fieldname: path} = request.file
        const{name,price,category_id}= request.body

        const product = await Product.create({
            name,
            price: price,
            category_id,
            path,
        })
        
        return response.json(product)
    }

    async index(request, response){
        const products = await Product.findAll()

        return response.json(products)

        
    }

    
}


export default new ProductsController()