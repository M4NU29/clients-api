import { PrismaClient, Prisma } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

export default class ClientModel {
	// Create a new client
	static async create(client) {
		const {
			firstName,
			middleName,
			firstSurname,
			secondSurname,
			email,
			address,
			phone,
			country
		} = client // Destructure the client object

		try {
			const newClient = await prisma.client.create({
				data: {
					firstName: firstName,
					middleName: middleName ?? null,
					firstSurname: firstSurname,
					secondSurname: secondSurname ?? null,
					email: email,
					address: address,
					phone: phone,
					country: country,
					// Fetch the demonym from the Rest Countries API based on the country code
					demonym: await fetch(`https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`)
						.then(response => response.json())
						.then(data => data.demonyms.eng.m) // Get the demonym from the response
				}
			})

			return newClient

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') { // Check if the error is a duplicate key error
					return { error: 'A client with that email already exists' }
				}
			}
			
			return { error: 'An error occurred while creating the client' }
		}
	}

	// Get all clients
	static async getAll(country, page = 1, limit = 10) {
		page = parseInt(page)
		limit = parseInt(limit)

		const totalClients = await prisma.client.count({
			// If country is provided, filter by country
			where: country ? { country: country } : {}
		})
		const totalPages = Math.ceil(totalClients / limit)

		let clients = await prisma.client.findMany({
			// If country is provided, filter by country
			where: country ? { country: country } : {},
			skip: (page - 1) * limit, // Skip the first N clients
			take: limit // Take only N clients
		})

		return {
			page,
			limit,
			totalItems: totalClients,
			totalPages,
			clients
		}
	}

	// Get a client by id
	static async getById(id) {
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

	// Update a client
	static async update(id, input) {
		// Destructure the input object
		const { email, address, phone, country } = input
		// Create an object with the data to update
		const data = { email, address, phone, country }

		if (country) {
			// If country is updated, fetch the demonym from the Rest Countries API based on the country code
			data.demonym = await fetch(`https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`)
				.then(response => response.json())
				.then(data => data.demonyms.eng.m) // Get the demonym from the response
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
				if (error.code === 'P2002') { // Check if the error is a duplicate key error
					return { error: 'A client with that email already exists' }
				}

				return { error: 'Client not found' }
			}

			return { error: 'An error occurred while updating the client' }
		}
	}

	// Delete a client
	static async delete(id) {
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
