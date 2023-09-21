import fs from 'fs'
import { utilService } from './util.service.js'


const toys = utilService.readJsonFile('data/toy.json')
const labels = ['Doll', 'Battery Powered', 'Talking', 'Beauty', 'Girls', 'Animal', 'Trip', 'Sport', 'Ride']

export const toyService = {
    query,
    get,
    remove,
    save,
}

function query(filterBy) {
    let toysToShow = toys
    toysToShow = onSetFilter(filterBy, toysToShow)
    return Promise.resolve(toysToShow)
}



function onSetFilter(filterBy, toysToShow) {
    const { sortBy, byName, byLable, inStock } = filterBy
    if (sortBy) toysToShow = onSetSortByFilter(sortBy, toysToShow)

    if (byLable && byLable[0]) {
        toysToShow = toysToShow.filter(toy => toy.labels.some(label => byLable.includes(label)))
    }

    if (byName) {
        const regExp = new RegExp(byName, 'i')
        toysToShow = toysToShow.filter(toy => regExp.test(toy.name))
    }
    if (inStock) {
        const regExp = new RegExp(inStock, 'i')
        toysToShow = toysToShow.filter(toy => regExp.test(toy.inStock))
    }
    return toysToShow
}

function onSetSortByFilter(sortBy, toysToShow) {
    if (sortBy === 'name') {
        toysToShow.sort((toyA, toyB) => toyA.name.localeCompare(toyB.name))
    } else if (sortBy === 'price') {
        toysToShow.sort((toyA, toyB) => toyA.price - toyB.price)
    } else if (sortBy === 'createdAt') {
        toysToShow.sort((toyA, toyB) => toyB.createdAt - toyA.createdAt)
    }
    return toysToShow
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found!')
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currtoy => currtoy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
    } else {
        let labelIdx = utilService.getRandomIntInclusive(0, labels.length)
        console.log('toy', toy)
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toy.lable = [labels[labelIdx]]
        toy.inStock = true
        console.log('toy ready', toy)
        toys.push(toy)
    }

    return _saveToysToFile().then(() => {
        return toy
    })
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}
