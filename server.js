const express = require('express')
const server = express()
const cors = require('cors')
const {ObjectId} = require('mongodb')

const {urlencoded, json} = require('body-parser')
const co = require('co')
const DatabaseManager = require('./tools/DatabaseManager')

server.use(json())
server.use(cors())
server.use(urlencoded({ extended: false }))
const PORT = 8082

let dbmanager = new DatabaseManager({url: 'mongodb://localhost:27017/vue-to-do-2'})


function sendResponse(result, code, message, payload){
    if(Number((code).toString().split('').slice(0,1)) !== 2){
        console.error(payload)
    }
    result.status(code).json({message,payload})
}

server.get('/', (req,res) => {
    sendResponse(res, 404, "This is not an active route.", [])
})

server.get('/tasks', (req, res) => {
    co(function *(){
        let taskCollection = dbmanager.getDatabase().collection('tasks')
        let tasks = yield taskCollection
                            .find({})
                            .toArray()
        sendResponse(res, 200, "Returning all tasks.", {tasks})
    })
    .catch((error) => {
        sendResponse(res, 500, "Error returning tasks.", {error})
    })
})

server.post('/tasks', (req, res) => {
    co(function *(){
        // let task = {title: 'Feed the cat', description:'Feed the cat', complete: true, history: []}
        // post a task
        let task = req.body.task
        
        let taskCollection = dbmanager.getDatabase().collection('tasks')
        let result = yield taskCollection.insertOne(task)
        // dbmanager.closeDatabase()
        sendResponse(res, 200, "Task inserted.", {record: result.ops[0]})
    })
    .catch((error) => {
        sendResponse(res, 500, "Error inserting task.", {error})
    })
})

server.get('/tasks/:id', (req,res) => {
    co(function *(){
        let id = req.params.id
        let taskcollection = dbmanager.getCollection('tasks')

        let task = yield taskcollection
                            .find({_id: ObjectId(id)})
                            .toArray()

        sendResponse(res, 200, "Task retrieved", {task})
    })
    .catch(error => {
        sendResponse(res, 500, "Error getting task.", {error})
    })
})

server.patch('/tasks/:id', (req, res) => {
    co(function *(){
        let id = req.params.id
        let task = req.body.task
        delete task._id

        let taskcollection = dbmanager.getCollection('tasks')

        yield taskcollection
                        .update(
                            {_id: ObjectId(id)},
                            task
                        )

        sendResponse(res, 200, "Task updated.", {})
    })
    .catch(error => {
        sendResponse(res, 500, "Error updating task.", {error})
    })
})

server.delete('/tasks/:id', (req, res) => {
    co(function *(){
        let id = req.params.id
        let taskcollection = dbmanager.getCollection('tasks')

        yield taskcollection
                .remove(
                    {_id: ObjectId(id)},
                    {justOne: true}
                )
        sendResponse(res, 200, "Task deleted", {})
    })
    .catch(error => {
        sendResponse(res, 500, "Error deleting task.", {error})
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})