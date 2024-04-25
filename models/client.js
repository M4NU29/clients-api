import { PrismaClient, Prisma } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

export class ClientModel {
	static async create(client) {
		// Create a new client
		const {
			firstName,
			secondName,
			firstSurname,
			secondSurname,
			email,
			address,
			phone,
			country
		} = client

		try {
			const newClient = await prisma.client.create({
				data: {
					firstName: firstName,
					secondName: secondName ?? null,
					firstSurname: firstSurname,
					secondSurname: secondSurname ?? null,
					email: email,
					address: address,
					phone: phone,
					country: country,
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

	static async getAll(country, page = 1, perPage = 10) {
		// Get all clients
		page = parseInt(page)
		perPage = parseInt(perPage)

		const totalClients = await prisma.client.count({
			where: country ? { country: country } : {}
		})
		const totalPages = Math.ceil(totalClients / perPage)

		let clients = await prisma.client.findMany({
			where: country ? { country: country } : {},
			skip: (page - 1) * perPage,
			take: perPage
		})

		return {
			page,
			per_page: perPage,
			total_count: totalClients,
			total_pages: totalPages,
			clients
		}
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

	static async update(id, input) {
		// Update a client
		const { email, address, phone, country } = input
		const data = { email, address, phone, country }

		if (country) {
			data.demonym = await fetch(`https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`)
				.then(response => response.json())
				.then(data => data.demonyms.eng.m)
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
