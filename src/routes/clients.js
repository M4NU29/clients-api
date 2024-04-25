import { Router } from 'express'
import { ClientController } from '../controllers/client-controller.js'

export const createClientRouter = (clientModel) => {
	const clientRouter = Router() // Create a new router
	const clientController = new ClientController(clientModel)

	// Define the routes for the client router
	clientRouter.post('/', clientController.create)
	clientRouter.get('/', clientController.getAll)
	clientRouter.get('/:id', clientController.getById)
	clientRouter.put('/:id', clientController.update)
	clientRouter.delete('/:id', clientController.delete)

	return clientRouter
}
