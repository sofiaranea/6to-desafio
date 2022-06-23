const express = require('express') //express
const Contenedor = require('./container') //container.js
const {engine} = require('express-handlebars') //handleBars
const {Server} = require('socket.io')  //socket.io
const http = require('http')


//container.js
const itemDB = 'productos.json'
const productos = new Contenedor(itemDB)


//express
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(__dirname + '/public'))
//app.use('/static', express.static('public'))  //Se esta definiendo el default renderizando index con HandleBars.


//handleBars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', './views')


//socket.io
const server = http.createServer(app)
const io = new Server(server)
//#############################################//
//#############################################//
//#############################################//
//#############################################//
app.get('/', (req, res) => {
    res.render('main')
})
app.get('/products', (req, res) => {
    res.render('products', {products, listExists: true})
})
app.get('/comments', (req, res) => {
    res.render('comments', {messages: contenedorMessages.getAll()})
})

//socket.io connection
const products = []
const contenedorProducts = new Contenedor('products.json')
const contenedorMessages = new Contenedor('messages.json')

io.on('connection', socket => {
    socket.on('add', data => {
        console.log(data)
        products.push(data)
        io.sockets.emit('show', products)
    })

    socket.on('chat-in', data => {
        const dateString = new Date().toLocaleString()
        const dataOut = {
            msn: data.msn,
            username: data.username,
            date: dateString
        }
        console.log(dataOut)
        contenedorMessages.save(dataOut)

        io.sockets.emit('chat-out', 'ok')
    })
})

server.listen(8080, () => {console.log('Server running...')})
