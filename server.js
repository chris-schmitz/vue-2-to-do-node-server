const express = require('express')
const server = express()
const cors = require('cors')
const {urlencoded, json} = require('body-parser')
const PORT = 8082

const mockTasks = require('../vue-todo-client/src/components/MockTasks.js')

server.use(json())
server.use(cors())
server.use(urlencoded({ extended: false }))


function sendResponse(result, code, message, payload){
    result.status(code).json({message,payload})
}

server.get('/', (req,res) => {
    sendResponse(res, 404, "This is not an active route.", [])
})

server.get('/tasks', (req, res) => {
    sendResponse(res, 200, "test worked", {tasks: mockTasks.tasks})
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