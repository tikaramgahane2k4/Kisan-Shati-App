# AgriExpense Frontend

React frontend for AgriExpense farmer's crop management system.

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Features
- User Authentication (Login/Register)
- Crop Management (Add, Edit, View, Delete)
- Expense Tracking for each crop
- Dashboard with crop overview
- Print/Export crop reports

## Tech Stack
- React 19 - UI library
- React Router - Routing
- Vite - Build tool
- Axios - HTTP client
- TailwindCSS - Styling

## Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── App.jsx         # Main app component
│   └── index.jsx       # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
