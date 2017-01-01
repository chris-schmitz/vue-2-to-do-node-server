const express = require('express')
const server = express()
const cors = require('cors')

const {urlencoded, json} = require('body-parser')
const co = require('co')
const DatabaseManager = require('./tools/DatabaseManager')

server.use(json())
server.use(cors())
server.use(urlencoded({ extended: false }))
const PORT = 8082

let dbmanager = new DatabaseManager({url: 'mongodb://localhost:27017/vue-to-do-2'})





// function getDbConnection(){
//     return new Promise((resolve, reject) => {
//         MongoClient.connect(dburl, (error, db) => {
//             if(error) reject(error)
//             resolve(db.collection('tasks'))
//         })
//     })
// }
// const mockTasks = require('../vue-todo-client/src/components/MockTasks.js')



function sendResponse(result, code, message, payload){
    result.status(code).json({message,payload})
}

server.get('/', (req,res) => {
    sendResponse(res, 404, "This is not an active route.", [])
})

server.get('/tasks', (req, res) => {
    co(function *(){
        let taskCollection = dbmanager.getDatabase().collection('tasks')
        let tasks = yield taskCollection
                            .find()
                            .toArray()
        dbmanager.closeDatabase()
        sendResponse(res, 200, "Returning all tasks.", {tasks})
    })
    .catch((error) => {
        sendResponse(res, 500, "Error returning tasks.", {error})
    })
    // co(function *(){
    //     let taskdb = yield getDbConnection()
    //     let tasks = yield taskdb.find().toArray()
    //     closeDbConnection()
    //    sendResponse(res, 200, "test worked", {tasks})
    // })
})

server.post('/tasks', (req, res) => {

    res.json({payload: {tasks: []}})
})

server.patch('/tasks/:id', (req, res) => {
    res.json({payload: req.params.id})
})

server.delete('/tasks/:id', (req, res) => {
    res.json({payload: req.params.id})
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})