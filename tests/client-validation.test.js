import {
	validateClient,
	validateClientPartially
} from '../src/middlewares/client-validation.js'

describe('Client validation', () => {
	describe('validateClient', () => {
		it('should validate a client with valid data', () => {
			const validClient = {
				firstName: 'Ramón',
				middleName: 'Augusto',
				firstSurname: 'Sánchez',
				secondSurname: 'González',
				email: 'agus@gmail.com',
				address: '243 St, Sabana Perdida, Santo Domingo Este',
				phone: '8096475123',
				country: 'DO'
			}
			const validationResult = validateClient(validClient)
			expect(validationResult.success).toBe(true)
		})

		it('should return an error for a client with invalid data', () => {
			const invalidClient = {
				firstName: '', // Empty first name
				middleName: 'Augusto',
				firstSurname: 'Sánchez',
				secondSurname: 'González',
				email: '@agus', // Invalid email format
				address: '243 St, Sabana Perdida, Santo Domingo Este',
				phone: '12345', // Invalid phone number format
				country: 'DOM' // Invalid country code
			}
			const validationResult = validateClient(invalidClient)
			expect(validationResult.success).toBe(false)
		})
	})

	describe('validateClientPartially', () => {
		it('should validate partial client info with valid data', () => {
			const validPartialClient = {
				email: 'alex.sm@hotmail.com'
			}
			const validationResult = validateClientPartially(validPartialClient)
			expect(validationResult.success).toBe(true)
		})

		it('should return an error for partial client info with invalid data', () => {
			const invalidPartialClient = {
				country: 'Dominican Republic' // Invalid country length and code format
			}
			const validationResult = validateClientPartially(invalidPartialClient)
			expect(validationResult.success).toBe(false)
		})
	})
})
