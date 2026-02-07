# AgriExpense Backend API

Backend API for AgriExpense farmer's crop management system using Express.js and MongoDB.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB
- Install MongoDB locally or use MongoDB Atlas (cloud)
- Create a database named `agriexpense`

### 3. Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agriexpense
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 4. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Crops
- `GET /api/crops` - Get all crops (protected)
- `GET /api/crops/:id` - Get single crop (protected)
- `POST /api/crops` - Create new crop (protected)
- `PUT /api/crops/:id` - Update crop (protected)
- `DELETE /api/crops/:id` - Delete crop (protected)

### Expenses
- `POST /api/expenses/:cropId` - Add expense to crop (protected)
- `PUT /api/expenses/:cropId/:expenseId` - Update expense (protected)
- `DELETE /api/expenses/:cropId/:expenseId` - Delete expense (protected)

## Protected Routes
Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Tech Stack
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing
