# Apotek APIs

Apotek APIs is a RESTful API service designed to support pharmacy management systems. This project provides endpoints to handle drug inventory, prescriptions, sales transactions, and other pharmacy-related functionalities, enabling easy integration with front-end applications or other systems.

## Features

- Manage drug inventory: add, update, delete, and list medicines
- Handle prescription records and validations
- Process sales transactions with detailed receipts
- User authentication and role management
- Secure and scalable API design

## Technologies Used

- [Your backend framework, e.g., Node.js, Express, Django, Flask]  
- [Database system, e.g., MySQL, PostgreSQL, MongoDB]  
- JWT for authentication (if applicable)  
- REST API standards  

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/novastellaa/apotek-APIs.git
   cd apotek-APIs
2. Install depedencies:
   ```bash
   # For Node.js example
   npm install

3. Configure environment variables:
   ```bash
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your_jwt_secret
   PORT=your_port

4. Run database migrations (if applicable):
   ```bash
   # Example for Sequelize ORM
   npx sequelize db:migrate

5. Start the server:
   ```bash
   npm start
