# Mesto API Backend Project

## Description
Mesto API is the backend infrastructure for the Mesto social media platform. Users can upload avatars, manage their cards by adding, deleting, liking, and unliking. This project is built to support the core functionality of the Mesto application.

## Technologies and Solutions
- **Typescript:** The project is primarily written in Typescript, providing enhanced readability, maintainability, and type safety.

- **MongoDB and Mongoose ODM:** User data is stored using MongoDB, with Mongoose serving as the Object Data Modeling (ODM) library. This combination ensures efficient data management and interaction.

- **Node.js:** The runtime environment for the project is Node.js, allowing for server-side JavaScript execution.

## Used Libraries
- **Express:** Express is used as the web application framework, simplifying the development of robust APIs.

- **Bcrypt:** Bcrypt is employed for password hashing, enhancing the security of user credentials.

- **Celebrate:** Celebrate is utilized for request validation, ensuring that incoming requests adhere to specified criteria.

- **Winston:** Winston is chosen as the logging library, providing flexible and extensible logging capabilities.

## Features
- User Authentication: Secure user authentication using bcrypt for password hashing.
- User Description Management: Users can upload and update their avatars and self information.
- Card Operations: CRUD operations for managing user cards, including adding, deleting, liking, and unliking.

## How to Use
1. Clone the repository: `https://github.com/galitsina/mesto-project-plus`
2. Install dependencies: `npm install`
3. Configure environment variables (e.g., database connection details, JWT secrets).
4. Start the server: `npm start`
5. Access the API at `http://localhost:3000` (or as configured).

