import { PrismaClient, Prisma } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

export class ClientModel {
	static async create(client) {
		// Create a new client
		const { country } = client

		try {
			const newClient = await prisma.client.create({
				data: {
					...client,
					demonym: await fetch(`https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`)
						.then(response => response.json())
						.then(data => data.demonyms.eng.m)
				}
			})

			return newClient

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return { error: 'A client with that email already exists' }
				}
			}
			return { error: 'An error occurred while creating the client' }
		}
	}

	static async getAll(country) {
		// Get all clients
		const clients = await prisma.client.findMany()

		if (country) {
			return clients.filter(client => client.country === country)
		}

		return clients
	}

	static async getById(id) {
		// Get a client by id
		try {
			const client = await prisma.client.findUnique({
				where: {
					id: id
				}
			})

			return client

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				return { error: 'Client not found' }
			}

			return { error: 'An error occurred while fetching the client' }
		}
	}

	static async update(id, data) {
		// Update a client
		const { country } = data

		if (country) {
			data = {
				...data,
				demonym: await fetch(`https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`)
					.then(response => response.json())
					.then(data => data.demonyms.eng.m)
			}
		}

		try {
			const client = await prisma.client.update({
				where: {
					id: id
				},
				data: data
			})

			return client

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return { error: 'A client with that email already exists' }
				}

				return { error: 'Client not found' }
			}

			return { error: 'An error occurred while updating the client' }
		}
	}

	static async delete(id) {
		// Delete a client
		try {
			const client = await prisma.client.delete({
				where: {
					id: id
				}
			})

			return client

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				return { error: 'Client not found' }
			}

			return { error: 'An error occurred while deleting the client' }
		}
	}
}
