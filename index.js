const app = require('./app')
const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

app.listen(config.PORT, () => {
  info(`Server starting on http://localhost:${config.PORT}`)
})

/* let data = [
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
 */
