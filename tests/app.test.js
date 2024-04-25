import request from 'supertest'
import express, { json } from 'express'
import ClientModel from '../src/models/client.js'
import { createClientRouter } from '../src/routes/clients.js'

// Create a new Express app instance
const app = express()
app.use(json())
app.use('/clients', createClientRouter(ClientModel))

describe('Client API calls', () => {
	describe('POST', () => {
		it('should create a client', async () => {
			const response = await request(app).post('/clients').send({
				firstName: 'Ramón',
				middleName: 'Alejandro',
				firstSurname: 'Sánchez',
				secondSurname: 'Ramírez',
				email: 'Alemon21@gmail.com',
				address: '243 Main St, Apt 3, Springfield, IL 62701',
				phone: '2175551234',
				country: 'US'
			})
			expect(response.statusCode).toBe(201)
		})
	})

	describe('GET', () => {
		it('should get all the clients', async () => {
			const response = await request(app).get('/clients?page=1&per_page=10')
			expect(response.statusCode).toBe(200)
		})

		it('should get all the clients from an specific country', async () => {
			const response = await request(app).get('/clients?country=DO&page=1&per_page=10')
			expect(response.statusCode).toBe(200)
		})

		it('should get an specific client by the id', async () => {
			const response = await request(app)
				.get('/clients/42a64405-1c23-4798-9a7d-973cf640ae1e')
			expect(response.statusCode).toBe(200)
		})
	})

	describe('PUT', () => {
		it('should update a client', async () => {
			const response = await request(app)
				.put('/clients/d45312e5-3689-418c-bc62-921a146e51ae').send({
					email: 'thenew@gmail.com'
				})
			expect(response.statusCode).toBe(200)
		})
	})

	describe('DELETE', () => {
		it('should delete an specific client by the id', async () => {
			const response = await request(app)
				.delete('/clients/a1d24fa8-0227-4fc7-9d63-36fae8430e7b')
			expect(response.statusCode).toBe(200)
		})
	})
})