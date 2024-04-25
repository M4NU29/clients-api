import { iso31661 } from 'iso-3166'
import z from 'zod'

const countryCodes = iso31661.map(country => country.alpha2)

const clientSchema = z.object({
	firstName: z.string().min(1).max(50),
	middleName: z.string().max(50).nullable().optional(),
	firstSurname: z.string().min(1).max(50),
	secondSurname: z.string().max(50).nullable().optional(),
	email: z.string().max(100).email(),
	address: z.string().min(1).max(500),
	phone: z.string().min(1).max(15)
		.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
			message: 'Phone must be a valid phone number'		
		}),
	country: z.string().min(1).max(3).refine(code => countryCodes.includes(code), {
		message: 'Country must be a valid ISO 3166 alpha-2 code'
	})
})

export const validateClient = (object) =>
	clientSchema.safeParse(object)
export const validateClientPartially = (object) =>
	clientSchema.partial().safeParse(object)
