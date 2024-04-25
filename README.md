## Clients API

This is a RESTful API built with Express.js and Prisma that allows you to manage clients.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**Prerequisites**

- Node.js
- PostgreSQL

**Installation**

1. Clone the repository
```
git clone https://github.com/M4NU29/clients-api.git
```
2. Install packages
```bash
npm install
# or
pnpm install
# or
bun install
#or
yarn install
```

3. Create a `.env` file in the root directory and add your PostgreSQL connection string as `DATABASE_URL`
```bash
DATABASE_URL="postgresql://user:password@localhost:3000/mydb?schema=public"
```

4. Run the database migrations
```bash
npx prisma migrate dev
```

5. Start the server
```bash
npm run start
# or
pnpm run start
# or
bun run start
# or
yarn run start
```

### API Endpoints

All routes are prefixed with `/clients`.


| Method   | Endpoint | Description          |
|----------|----------|----------------------|
| `POST`   | `/`      | Create a new client |
| `GET`    | `/`      | Get all clients      |
| `GET`    | `/:id`   | Get a client by ID   |
| `PUT`    | `/:id`   | Update a client      |
| `DELETE` | `/:id`   | Delete a client      |



### Models

**Client**

| Field          | Type   | Description                           |
|----------------|--------|---------------------------------------|
| `id`           | `string` | The client's ID                       |
| `firstName`    | `string` | The client's first name               |
| `middleName`   | `string` | The client's middle name              |
| `firstSurname` | `string` | The client's first surname            |
| `secondSurname`| `string` | The client's second surname           |
| `email`        | `string` | The client's email                    |
| `address`      | `string` | The client's address                  |
| `phone`        | `string` | The client's phone number             |
| `country`      | `string` | The client's country (ISO 3166 alpha-2 code) |
| `demonym`      | `string` | The client's demonym                  |

### Validation

The client data is validated using the Zod library. The validation schema is as follows:
```js
const clientSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50).nullable().optional(),
    firstSurname: z.string().min(1).max(50),
    secondSurname: z.string().max(50).nullable().optional(),
    email: z.string().max(100).email(),
    address: z.string().min(1).max(500),
    phone: z.string().max(15)
        .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
            message: 'Phone must be a valid phone number'		
        }),
    country: z.string().refine(code => countryCodes.includes(code), {
        message: 'Country must be a valid ISO 3166 alpha-2 code'
    })
})
```

### Error handling

Errors are handled in the controllers and models. If an error occurs, the API will return a JSON response with the error message.
