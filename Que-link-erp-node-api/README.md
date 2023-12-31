# Que_link-isp-management-system API Node Express Mongoose Example

The project builds RESTful APIs using Node.js, Express and Mongoose, ...

## Manual Installation

Clone the repo:

```bash
git clone https://github.com/aliakbar192/Que_link-isp-management-system-
cd Que-link-erp-node-api
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env
# open .env and modify the environment variables
```

Generate JWT RS256 key:

```bash
ssh-keygen -t rsa -P "" -b 2048 -m PEM -f storage/jwtRS256.key
ssh-keygen -e -m PEM -f storage/jwtRS256.key > storage/jwtRS256.key.pub
# encode base64
cat storage/jwtRS256.key | base64 # edit JWT_ACCESS_TOKEN_SECRET_PRIVATE in .env
cat storage/jwtRS256.key.pub | base64 # edit JWT_ACCESS_TOKEN_SECRET_PUBLIC in .env
```

## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Commands

Running in development:

```bash
npm start
# or
npm run dev
```

Running in production:

```bash
# build
npm run build
# start
npm run prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=secretkey
DB_HOST=localhost
DB_PORT=3306
DB_NAME=telecom
DB_USERNAME=root
DB_PASSWORD=
DB_DIALECT=mysql
JWT_AUTH_EXPIRE_TIME=1440
JWT_ACCESS_EXPIRE_TIME=1440
JWT_RESET_EXPIRE_TIME=5
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_EMAIL_FROM=
```

## Project Structure

```
public\             # Public folder
 |--index.html      # Static html
src\
 |--config\         # Environment variables and configuration
 |--controllers\    # Controllers
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models
 |--routes\         # Routes
 |--services\       # Business logic
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--index.js        # App entry point
```

## License

[MIT](LICENSE)
