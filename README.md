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
```

3. Create a `.env` file in the root directory, add your PostgreSQL connection string as `DATABASE_URL`, specify the `PORT` on which the server will run and add `ALLOWED_ORIGINS` to specify the origins that are allowed to access your API. In `ALLOWED_ORIGINS`, you can list multiple origins separated by commas. This will be used for the CORS configuration of your server
```bash
DATABASE_URL="postgresql://user:password@localhost:3000/mydb?schema=public"
PORT=3000
ALLOWED_ORIGINS=http://localhost:1234,https://myapp.com,https://myapp.net
```

4. Run the database migrations
```bash
npx prisma migrate dev
```

5. Start the server
```bash
npm run start
```

### API Endpoints

All routes are prefixed with `/clients`.


| Method   | Endpoint | Description          |
|----------|----------|----------------------|
| `POST`   | `/`      | Create a new client |
| `GET`    | `/`      | Get all clients. Supports pagination with `page` and `limit` query parameters.      |
| `GET`    | `/:id`   | Get a client by ID   |
| `PUT`    | `/:id`   | Update a client      |
| `DELETE` | `/:id`   | Delete a client      |

**Pagination**

The `GET /clients` endpoint supports pagination. You can specify the page number and the number of items per page with the page and per_page query parameters respectively. For example, to get the first 10 clients, you would use `/clients?page=1&limit=10`.

**Filtering**

The `GET /clients` endpoint also supports filtering by country. You can specify the country with the country query parameter. For example, to get all clients from the Dominican Republic, you would use `/clients?country=DO`.

You can also combine filtering and pagination. For example, to get the first 10 clients from the Dominican Republic, you would use `/clients?country=DO&page=1&limit=10`.

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

**Demonym**

This application uses the [REST Countries API](https://restcountries.com/) to fetch the demonym associated with the country code of each client. The country code is validated using the `iso-3166` library and then used to fetch the corresponding demonym from the endpoint `https://restcountries.com/v3.1/alpha/${country}?fields=demonyms`. This process happens automatically when creating or updating a client.

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

### Testing

This project uses Jest and Supertest for testing. There are two types of tests: API tests and validation tests.

**API Tests**

API tests are located in `./tests/app.test.js`. They test the API endpoints and ensure they are working as expected.

**Validation Tests**

Validation tests are located in `./tests/client-validation.test.js`. They test the client data validation logic to ensure it correctly validates the data.

To run all tests, use the following command:
```bash
npm run test
```

### Dependencies

This project uses several dependencies to provide its functionality:

- **Express.js**: A fast, unopinionated, and flexible Node.js web application framework. It is used to create the API endpoints.

- **CORS**: A Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. It is used to handle Cross-Origin Resource Sharing in this project.

- **Prisma**: An open-source database toolkit and ORM. It is used to interact with the database.

- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`. It is used to manage environment variables.

- **Zod**: A JavaScript library for building schemas and validating data. It is used for data validation in this project.

- **iso-3166**: A library for validating and working with ISO 3166 country codes. It is used to validate the `country` field in the client data.

- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity. It is used to write and run the tests.

- **Supertest**: A high-level abstraction for testing HTTP. It is used in conjunction with Jest to test the API endpoints.

- **Eslint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. It is used to maintain code quality and find problems.
