# Encrypt App

Application showing an example of using [Decorator](https://en.wikipedia.org/wiki/Decorator_pattern) and [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) design patterns. For this purpose, the popular [typedi](https://www.npmjs.com/package/typedi) and [routing-controllers](https://www.npmjs.com/package/routing-controllers) libraries were used. In addition, the application uses [JWT tokens](https://jwt.io/introduction) to authorize users.

## Endpoints
You can import Postman collection from **docs** directory with all API endpoints.

- `POST localhost:3000/api/register` - *register new user*
- `POST localhost:3000/api/sign-in` - *get JWT token for the user*
- `POST localhost:3000/api/generate-key-pair` - *generate private and public key pair for the user*
- `POST localhost:3000/api/encrypt` - *encrypt sample file **data/documents/sample.pdf** by user public key*

## Local Setup

### Run app in Docker's container
Just type: `npm run docker` and wait until you see in the console: "Application listening on port 3000"

If it does not work, you probably have some permissions problems - fix them
or run app directly on your local machine

### Run app directly on your local machine
1. Generate local files: `npm run create-files-from-dist`
2. Set a valid configuration to your database in the **config/local.json** file
3. Install dependencies: `npm install`
4. Compile Typescript files: `npm run build`
5. Run migrations: `npm run migration:run`
6. Run app: `npm run start`
