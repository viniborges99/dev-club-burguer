import * as Yup from 'yup'
import User from "../models/User"
import Category from '../models/Category'
import { response } from 'express'


class CategoryController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),

        })


        try {
            await schema.validateSync(request.body, { abortEarly: false })
        } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin} = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json()
        }

        const { name } = request.body

        const categoryExists = await Category.findOne({
            where: {name}
        })

        if(categoryExists){
            return response.status(400).json({error: "categoria já existente"})
        }

        const category = await Category.create({
            name

        })

        return response.json({name, id})//ou category
    
    }

    async index(request, response) {
        const category = await Category.findAll()

        return response.json(category)


    }


}


export default new CategoryController()