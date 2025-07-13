# Personal Notes & Bookmark Manager

A full-stack web application for managing personal notes and bookmarks with search, filtering, and tagging capabilities.

## 🚀 Tech Stack

**Backend:**

- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Axios for URL metadata fetching

**Frontend:**

- Next.js (JavaScript/React)
- Tailwind CSS
- Axios for API calls
- React Hooks for state management

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository and navigate to backend:**

```bash
git clone https://github.com/vishnuu5/notes-bookmark-manager.git
cd notes-bookmark-manager
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment Configuration:**
   Create a \`.env\` file in the backend directory:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-bookmark-manager
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

4. **Start MongoDB:**

   - Local: \`mongod\`
   - Or use MongoDB Atlas connection string

5. **Run the backend server:**

```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd ../frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment Configuration:**
   Create a \`.env.local\` file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Run the frontend server:**

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### Register User

- **POST** \`/api/auth/register\`
- **Body:**
  \`\`\`json
  {
  "username": "user",
  "email": "user@example.com",
  "password": "password123"
  }
  \`\`\`

#### Login User

- **POST** \`/api/auth/login\`
- **Body:**
  \`\`\`json
  {
  "email": "user@example.com",
  "password": "password123"
  }
  \`\`\`

### Notes API

#### Get All Notes

- **GET** \`/api/notes\`
- **Query Parameters:**
  - \`q\`: Search term (optional)
  - \`tags\`: Comma-separated tags (optional)
  - \`favorites\`: true/false (optional)
- **Headers:** \`Authorization: Bearer <token>\`

#### Create Note

- **POST** \`/api/notes\`
- **Headers:** \`Authorization: Bearer <token>\`
- **Body:**
  \`\`\`json
  {
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "important"],
  "isFavorite": false
  }
  \`\`\`

#### Get Single Note

- **GET** \`/api/notes/:id\`
- **Headers:** \`Authorization: Bearer <token>\`

#### Update Note

- **PUT** \`/api/notes/:id\`
- **Headers:** \`Authorization: Bearer <token>\`
- **Body:** Same as create note

#### Delete Note

- **DELETE** \`/api/notes/:id\`
- **Headers:** \`Authorization: Bearer <token>\`

### Bookmarks API

#### Get All Bookmarks

- **GET** \`/api/bookmarks\`
- **Query Parameters:**
  - \`q\`: Search term (optional)
  - \`tags\`: Comma-separated tags (optional)
  - \`favorites\`: true/false (optional)
- **Headers:** \`Authorization: Bearer <token>\`

#### Create Bookmark

- **POST** \`/api/bookmarks\`
- **Headers:** \`Authorization: Bearer <token>\`
- **Body:**
  \`\`\`json
  {
  "title": "Google",
  "url": "https://google.com",
  "description": "Search engine",
  "tags": ["search", "tools"],
  "isFavorite": false
  }
  \`\`\`

#### Get Single Bookmark

- **GET** \`/api/bookmarks/:id\`
- **Headers:** \`Authorization: Bearer <token>\`

#### Update Bookmark

- **PUT** \`/api/bookmarks/:id\`
- **Headers:** \`Authorization: Bearer <token>\`
- **Body:** Same as create bookmark

#### Delete Bookmark

- **DELETE** \`/api/bookmarks/:id\`
- **Headers:** \`Authorization: Bearer <token>\`

## 🧪 Sample cURL Requests

### Register a new user:

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \\
-H "Content-Type: application/json" \\
-d '{
"username": "testuser",
"email": "test@example.com",
"password": "password123"
}'
\`\`\`

### Login:

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "test@example.com",
"password": "password123"
}'
\`\`\`

### Create a note:

\`\`\`bash
curl -X POST http://localhost:5000/api/notes \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_JWT_TOKEN" \\
-d '{
"title": "My First Note",
"content": "This is my first note content",
"tags": ["personal", "test"]
}'
\`\`\`

### Create a bookmark:

\`\`\`bash
curl -X POST http://localhost:5000/api/bookmarks \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_JWT_TOKEN" \\
-d '{
"title": "GitHub",
"url": "https://github.com",
"description": "Code repository platform",
"tags": ["development", "tools"]
}'
\`\`\`

## ✨ Features

### Core Features

- ✅ User authentication (JWT)
- ✅ CRUD operations for notes and bookmarks
- ✅ Search functionality
- ✅ Tag-based filtering
- ✅ Responsive design
- ✅ Mark items as favorites

### Bonus Features

- ✅ Auto-fetch bookmark metadata (title from URL)
- ✅ User-specific data isolation
- ✅ Advanced search and filtering
- ✅ Clean and modern UI

## 🎯 Skills Demonstrated

- **REST API Design:** Well-structured endpoints with proper HTTP methods
- **Data Validation:** Input validation and error handling
- **React/Next.js:** Modern React patterns with hooks and routing
- **Tailwind CSS:** Responsive and clean UI design
- **Clean Code:** Modular structure and separation of concerns
- **Real-world Data Modeling:** User, Note, and Bookmark relationships

## 🔧 Development Scripts

### Backend

- \`npm run dev\`: Start development server with nodemon
- \`npm start\`: Start production server

### Frontend

- \`npm run dev\`: Start Next.js development server
- \`npm run build\`: Build for production
- \`npm start\`: Start production server

## 🚀 Deployment

### Backend Deployment (Render)

1. Set environment variables
2. Deploy with: \`git push heroku main\`

### Frontend Deployment (Vercel)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 📝 License

This project is licensed under the MIT License.
