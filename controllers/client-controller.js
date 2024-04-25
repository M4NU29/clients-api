import {
	validateClient,
	validateClientPartially
} from '../middlewares/client-validation.js'

export class ClientController {
	constructor(clientModel) {
		this.clientModel = clientModel
	}

	create = async (req, res) => {
		const client = validateClient(req.body)

		if (client.error) {
			return res.status(400).json({ error: JSON.parse(client.error.message) })
		}

		const newClient = await this.clientModel.create(client.data)
		return res.status(201).json(newClient)
	}

	getAll = async (req, res) => {
		const { country } = req.query
		const clients = await this.clientModel.getAll(country)
		return res.json(clients)
	}

	getById = async (req, res) => {
		const { id } = req.params
		const client = await this.clientModel.getById(id)

		if (!client) {
			return res.status(404).json({ error: 'Client not found' })
		}

		return res.json(client)
	}

	update = async (req, res) => { 
		const { id } = req.params
		const client = validateClientPartially(req.body)

		if (client.error) {
			return res.status(400).json({ error: JSON.parse(client.error.message) })
		}

		const updatedClient = await this.clientModel.update(id, client.data)

		if (!updatedClient) {
			return res.status(404).json({ error: 'Client not found' })
		}

		return res.json(updatedClient)
	}

	delete = async (req, res) => {
		const { id } = req.params
		const deletedClient = await this.clientModel.delete(id)

		if (!deletedClient) {
			return res.status(404).json({ error: 'Client not found' })
		}

		return res.json({
			deletedClient: deletedClient,
			message: 'Client deleted successfully'
		})
	}
}
