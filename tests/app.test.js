import { jest } from '@jest/globals'
import ClientModel from '../src/models/client.js'
import request from 'supertest'
import express, { json } from 'express'
import { createClientRouter } from '../src/routes/clients.js'

const app = express()
app.use(json()) // Parse JSON request bodies
app.use('/clients', createClientRouter(ClientModel))

describe('Client API calls', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	describe('POST', () => {
		it('should create a client', async () => {
			// Mock the create method of the ClientModel
			ClientModel.create = jest.fn().mockResolvedValue({
				id: '7ee7c662-4206-4088-85dc-6f48e40818c2',
				firstName: 'Ramón',
				middleName: 'Alejandro',
				firstSurname: 'Sánchez',
				secondSurname: 'Ramírez',
				email: 'Alemon21@gmail.com',
				address: '243 Main St, Apt 3, Springfield, IL 62701',
				phone: '2175551234',
				country: 'US',
				demonym: 'American'
			})

			const response = await request(app).post('/clients/').send({
				firstName: 'Ramón',
				middleName: 'Alejandro',
				firstSurname: 'Sánchez',
				secondSurname: 'Ramírez',
				email: 'alemon21@gmail.com',
				address: '243 Main St, Apt 3, Springfield, IL 62701',
				phone: '2175551234',
				country: 'US'
			})

			expect(response.statusCode).toBe(201)
		})
	})

	describe('GET', () => {
		it('should get all the clients', async () => {
			// Mock the getAll method of the ClientModel
			ClientModel.getAll = jest.fn().mockResolvedValue({
				page: 1,
				limit: 10,
				totalPages: 1,
				totalItems: 1,
				clients: [
					{
						id: 'b5001cd3-fe5d-48e1-86c1-0852badfe48c',
						firstName: 'Sara',
						middleName: null,
						firstSurname: 'González',
						secondSurname: null,
						email: 'sara@hotmail.com',
						address: '23 Main St, Toronto, ON M5V 1A1, Canada',
						phone: '4166847515',
						country: 'CA',
						demonym: 'Canadian'
					},
					{
						id: '5f75fe07-37c8-4551-b2b3-a7b90cc9bfff',
						firstName: 'Arthur',
						middleName: 'David',
						firstSurname: 'Doyle',
						secondSurname: 'Smith',
						email: 'addmin@gmail.com',
						address: '486 First St, Sydney, NSW 2000, Australia',
						phone: '6126749852',
						country: 'AU',
						demonym: 'Australian'
					}
				]
			})

			const response = await request(app).get('/clients/?page=1&limit=10')
			expect(response.statusCode).toBe(200)
		})

		it('should get a specific client by the id', async () => {
			// Mock the getById method of the ClientModel
			ClientModel.getById = jest.fn().mockResolvedValue({
				id: 'b5001cd3-fe5d-48e1-86c1-0852badfe48c',
				firstName: 'Sara',
				middleName: null,
				firstSurname: 'González',
				secondSurname: null,
				email: 'sara@hotmail.com',
				address: '23 Main St, Toronto, ON M5V 1A1, Canada',
				phone: '4166847515',
				country: 'CA',
				demonym: 'Canadian'
			})

			const response = await request(app)
				.get('/clients/b5001cd3-fe5d-48e1-86c1-0852badfe48c')
			expect(response.statusCode).toBe(200)
		})
	})

	describe('PUT', () => {
		it('should update a client', async () => {
			// Mock the update method of the ClientModel
			ClientModel.update = jest.fn().mockResolvedValue({
				id: 'b5001cd3-fe5d-48e1-86c1-0852badfe48c',
				firstName: 'Sara',
				middleName: null,
				firstSurname: 'González',
				secondSurname: null,
				email: 'thenewsara@hotmail.com',
				address: '23 Main St, Toronto, ON M5V 1A1, Canada',
				phone: '4166847515',
				country: 'CA',
				demonym: 'Canadian'
			})

			const response = await request(app)
				.put('/clients/b5001cd3-fe5d-48e1-86c1-0852badfe48c')
				.send({
					email: 'thenewsara@gmail.com'
				})

			expect(response.statusCode).toBe(200)
		})
	})

	describe('DELETE', () => {
		it('should delete a specific client by the id', async () => {
			// Mock the delete method of the ClientModel
			ClientModel.delete = jest.fn().mockResolvedValue({
				id: 'b5001cd3-fe5d-48e1-86c1-0852badfe48c',
				firstName: 'Sara',
				middleName: null,
				firstSurname: 'González',
				secondSurname: null,
				email: 'sara@hotmail.com',
				address: '23 Main St, Toronto, ON M5V 1A1, Canada',
				phone: '4166847515',
				country: 'CA',
				demonym: 'Canadian'
			})

			const response = await request(app)
				.delete('/clients/b5001cd3-fe5d-48e1-86c1-0852badfe48c')
			expect(response.statusCode).toBe(200)
		})
	})
})
