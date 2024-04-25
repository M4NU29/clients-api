import express, { json } from 'express'
import ClientModel from './models/client.js'
import { createClientRouter } from './routes/clients.js'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')

app.use(json())
app.use('/clients', createClientRouter(ClientModel))
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
