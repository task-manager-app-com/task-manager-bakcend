# 📄 Task Manager Application - Backend

This is the backend application for the **Task Manager Application**, a platform that allows users to manage their futuer tasks. 

---

## 🚀 Getting Started
Follow these instructions to set up and run the backend server locally.

### Prerequisites
- Node.js (v14 or higher)
- npm
- MySQL

### 📦 Installation

# Clone the repository
https://github.com/Virtual-Pet-Adoption-Center/pet-adoption-backend.git

# Navigate into the project directory
cd pet-adoption-backend

# Install dependencies
npm install

# Run the server
npx nodemon server.js
The backend server will run on http://localhost:8080.

### 🛠️ Tech Stack
- Node.js – JavaScript runtime
- Express.js – Web server framework, 
- CORS – Cross-Origin Resource Sharing, enable CORS
- MySQL – Relational database for storing task data
- nodemon – Development utility (for auto-restart)

### 📌 API Endpoints
Below is the list of available REST API endpoints provided by the backend:

+--------+--------------------------------------+--------------------------------------------+
| Method | Endpoint                             | Description                                |
+--------+--------------------------------------+--------------------------------------------+
| POST   | /addTask                             | Add a new task                             |
| GET    | /getTasks                            | Retrieve recent 5 todo tasks               |
| GET    | /completedTasks                      | Retrieve completed tasks                 |
| PATCH  | /completeTask/:id/complete           | Complete a task                            |
+--------+--------------------------------------+--------------------------------------------+

## 🗄️ Database
This project uses MySQL relational database to store data related to tasks and user interactions.

## 📬 Contact
For questions or collaboration, feel free to reach out:

Hashini Thilinika
📧 Email: hashinithilinika.av@gmail.com