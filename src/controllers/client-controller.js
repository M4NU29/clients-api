import {
	validateClient,
	validateClientPartially
} from '../middlewares/client-validation.js'

export class ClientController {
	constructor(clientModel) {
		this.clientModel = clientModel // Store the client model
	}

	create = async (req, res) => {
		const client = validateClient(req.body)

		if (client.error) {
			// Return the validation error
			return res.status(400).json({ error: JSON.parse(client.error.message) })
		}

		const newClient = await this.clientModel.create(client.data) // Create the client

		if (newClient.error) {
			// Return the error from the model
			return res.status(400).json({ error: newClient.error })
		}

		return res.status(201).json(newClient) // Return the new client
	}

	getAll = async (req, res) => {
		const { country, page, per_page } = req.query // Get the specified query parameters
		const clients = await this.clientModel.getAll(country, page, per_page)
		return res.json(clients)
	}

	getById = async (req, res) => {
		const { id } = req.params // Get the client ID from the URL
		const client = await this.clientModel.getById(id)

		if (!client) {
			// Return a 404 error if the client is not found
			return res.status(404).json({ error: 'Client not found' })
		}

		return res.json(client)
	}

	update = async (req, res) => { 
		const { id } = req.params // Get the ID from the URL
		const client = validateClientPartially(req.body) // Validate the client data

		if (client.error) {
			// Return the validation error
			return res.status(400).json({ error: JSON.parse(client.error.message) })
		}

		const updatedClient = await this.clientModel.update(id, client.data)

		if (updatedClient.error) {
			// Return the error from the model
			return res.status(404).json({ error: updatedClient.error })
		}

		return res.json(updatedClient)
	}

	delete = async (req, res) => {
		const { id } = req.params // Get the ID from the URL
		const deletedClient = await this.clientModel.delete(id)

		if (deletedClient.error) {
			// Return the error from the model
			return res.status(404).json({ error: deletedClient.error })
		}

		// Return the deleted client
		return res.json({
			deletedClient: deletedClient,
			message: 'Client deleted successfully'
		})
	}
}
