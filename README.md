# The CRUD Application

A full-stack CRUD application with Node.js/Express backend and React frontend.

## Project Structure

```
the-crud/
├── client/          # React frontend
├── server/          # Node.js/Express backend
└── package.json     # Root package.json
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create a `.env` file in the server directory with the following content:

```
PORT=5000
NODE_ENV=development
```

## Running the Application

### Development Mode

To run both the frontend and backend simultaneously:

```bash
npm run dev
```

### Running Separately

To run the backend server:

```bash
npm run start:server
```

To run the frontend:

```bash
npm run start:client
```

## Features

- Express.js backend with RESTful API
- React frontend with modern UI
- CORS enabled for cross-origin requests
- Environment variable configuration
- Concurrent development server

## Technologies Used

- Backend:

  - Node.js
  - Express.js
  - CORS
  - dotenv

- Frontend:
  - React
  - Create React App
  - Axios
