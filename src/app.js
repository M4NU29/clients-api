import express, { json } from 'express'
import ClientModel from './models/client.js'
import { createClientRouter } from './routes/clients.js'
import 'dotenv/config' // Load environment variables from the .env file

const app = express() // Create the Express application
const PORT = process.env.PORT ?? 3000 // Port the server will listen on

app.disable('x-powered-by')
app.use(json()) // Parse JSON request bodies
app.use('/clients', createClientRouter(ClientModel)) // Mount the client router
app.use((req, res) => { // Route handler for any requests that don't match
	res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => { // Start the server
	console.log(`Server is running on http://localhost:${PORT}`)
})
