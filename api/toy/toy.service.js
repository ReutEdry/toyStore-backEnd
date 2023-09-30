import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'



const labels = ['Doll', 'Battery Powered', 'Talking', 'Beauty', 'Girls', 'Animal', 'Trip', 'Sport', 'Ride']
const urls = ['https://shop.mattel.com/cdn/shop/products/bo8pb5ljodhxnar2q3up_f7c7b217-012a-4f27-abe2-8526040bd352.jpg?v=1687179676', 'https://images.unsplash.com/photo-1633469924738-52101af51d87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'https://image.smythstoys.com/original/desktop/216934.jpg']


export const toyService = {
    remove,
    query,
    getById,
    add,
    update
    // addCarMsg,
    // removeCarMsg
}

async function query(filterBy) {
    try {
        const criteria = {}
        if (filterBy.byName) {
            const regex = new RegExp(filterBy.byName, 'i')
            criteria.name = { $regex: regex }
        }

        if (filterBy.sortBy) {
            const sort = filterBy.sortBy
            criteria[sort] = { $sort: { sort: 1 } }
        }

        if (filterBy.byLable) {
            criteria.labels = { $in: [filterBy.byLable] }
        }

        if (filterBy.inStock) {
            criteria.inStock = { $eq: filterBy.inStock }
        }


        const collection = await dbService.getCollection('toy')
        let toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

export async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    let labelIdx = utilService.getRandomIntInclusive(0, labels.length)
    let imgIdx = utilService.getRandomIntInclusive(0, urls.length)
    toy.createdAt = Date.now()
    toy.labels = [labels[labelIdx]]
    toy.inStock = true
    toy.img = urls[imgIdx]
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${carId}`, err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

