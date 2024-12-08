const express = require('express')
const app = express()
const PORT = 3001

// Middleware for parsing JSON
app.use(express.json())

let data = [
  {
    id: '1',
    data: 'HTML is easy',
  },
  {
    id: '2',
    data: 'Browser can execute only JavaScript',
  },
  {
    id: '3',
    data: 'GET and POST are the most important methods of HTTP protocol',
  },
]

// basic route
app.get('/', (req, res) => {
  res.send('<H1>Hello World!!!</H1>')
})

// get data router
app.get('/api/data', (req, res) => {
  res.json(data)
})

// Add data
app.post('/api/data', (req, res) => {
  const newData = req.body
  res.json({ message: 'Data has been added.', data: data.push(newData) })
})

app.listen(PORT, () => {
  console.log(`Server starting on http://localhost:${PORT}`)
})

/* const http = require('http')

// create server
const server = http.createServer((req, resp) => {
  resp.writeHead(200, { 'Content-ype': 'text/plain' })
  resp.end('Hello from server')
})

// set PORT number and start the server
const PORT = 3001
server.listen(PORT, () => {
  console.log('Server starting on port: ', PORT)
}) */
