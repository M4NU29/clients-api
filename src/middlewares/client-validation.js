import { iso31661 } from 'iso-3166'
import z from 'zod'

// Get all ISO 3166 alpha-2 codes
const countryCodes = iso31661.map(country => country.alpha2)

const clientSchema = z.object({
	firstName: z.string().min(1).max(50),
	middleName: z.string().max(50).nullable().optional(),
	firstSurname: z.string().min(1).max(50),
	secondSurname: z.string().max(50).nullable().optional(),
	email: z.string().max(100).email(),
	address: z.string().min(1).max(500),
	phone: z.string().max(15)
		// Only allows numbers, spaces, the characters +()- and a minimum of 10 digits
		.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
			message: 'Phone must be a valid phone number'		
		}),
	// Validates the country code against the ISO 3166 alpha-2 codes
	country: z.string().refine(code => countryCodes.includes(code), {
		message: 'Country must be a valid ISO 3166 alpha-2 code'
	})
})

// Validate the object against the schema
export const validateClient = (object) =>
	clientSchema.safeParse(object)

// Validate the object partially against the schema
export const validateClientPartially = (object) =>
	clientSchema.partial().safeParse(object)
