import * as Yup from 'yup'
import User from "../models/User"
import Product from '../models/Product'
import { response } from 'express'
import Category from '../models/Category'


class ProductsController {
    async store(request, response) {
        try {


            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                category_id: Yup.number().required(),
                offer: Yup.boolean(),
            })


            try {
                await schema.validateSync(request.body, { abortEarly: false })
            } catch (err) {
                return response.status(400).json({ error: err.errors })
            }

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { filename: path } = request.file
            const { name, price, category_id, offer } = request.body

            const product = await Product.create({
                name,
                price: price,
                category_id,
                path,
                offer,
            })

            return response.json(product)
        } catch { }
    }

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        })

        return response.json(products)
    }

    async update(request, response) {
        try {


            const schema = Yup.object().shape({
                name: Yup.string(),
                price: Yup.number(),
                category_id: Yup.number(),
                offer: Yup.boolean(),
            })


            try {
                await schema.validateSync(request.body, { abortEarly: false })
            } catch (err) {
                return response.status(400).json({ error: err.errors })
            }

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { id } = request.params

            const product = await Product.findByPk(id)

            if (!product) {
                return response.status(401).json({ error: 'make sure your product id is correct ' })
            }

            let path
            if (request.file) {
                path = request.file.filename
            }


            const { name, price, category_id, offer } = request.body

            await Product.create({
                name,
                price,
                category_id,
                path,
                offer,
            },
                { where: { id } }
            )

            return response.status(200).json()
        } catch { }
    }


}


export default new ProductsController()