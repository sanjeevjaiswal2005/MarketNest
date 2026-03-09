# MarketNest - Mini Fashion Marketplace

A full-stack fashion marketplace built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

![MarketNest](https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop)

## Features

### For Customers
- Browse products by category
- Search products by name
- View detailed product information
- Image gallery with navigation
- Server-side pagination

### For Brands (Sellers)
- Professional dashboard with stats
- Create and manage products
- Upload multiple product images
- Save as draft or publish immediately
- Edit and delete own products
- Ownership enforcement

### Authentication & Security
- JWT-based authentication (Access + Refresh tokens)
- Password hashing with bcrypt
- Role-based authorization (Brand/Customer)
- Protected routes
- Secure cookie handling
- Input validation

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access Token + Refresh Token)
- **Password Hashing**: bcrypt
- **Image Upload**: Cloudinary
- **Validation**: express-validator

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## Project Structure

```
/marketnest
├── server/                    # Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── categoryController.js
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Category.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── utils/              # Utilities
│   │   ├── jwtUtils.js
│   │   └── cloudinary.js
│   ├── .env                # Environment variables
│   ├── server.js           # Entry point
│   └── package.json
│
├── client/                   # Frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   │   └── axios.js
│   │   ├── components/    # React components
│   │   │   ├── Layout/
│   │   │   ├── UI/
│   │   │   └── Product/
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   │   ├── Home/
│   │   │   ├── Auth/
│   │   │   ├── Shop/
│   │   │   ├── ProductDetail/
│   │   │   └── Dashboard/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── SPEC.md                   # Project specification
└── README.md
```

---

## Architecture

### Backend Architecture

The backend follows a clean MVC (Model-View-Controller) pattern:

1. **Routes** - Define API endpoints and map them to controller functions
2. **Controllers** - Handle request/response logic
3. **Models** - Define MongoDB schemas
4. **Middleware** - Handle authentication and authorization
5. **Utils** - Helper functions (JWT, Cloudinary)

### Frontend Architecture

The frontend uses a component-based architecture:

1. **Pages** - Route-level components
2. **Components** - Reusable UI components
3. **Context** - Global state (Auth)
4. **API** - Centralized Axios configuration
5. **Hooks** - Custom React hooks

---

## Authentication Flow

### Registration
```
1. User submits registration form (name, email, password, role)
2. Server validates input
3. Server hashes password with bcrypt
4. Server creates user in MongoDB
5. Server generates JWT access + refresh tokens
6. Server sends refresh token as httpOnly cookie
7. Server returns access token in response
8. Client stores access token and user data
```

### Login
```
1. User submits login form (email, password)
2. Server validates credentials
3. Server compares password with hashed password
4. Server generates JWT tokens
5. Server sends refresh token as httpOnly cookie
6. Server returns access token
7. Client stores access token
```

### Token Refresh
```
1. Access token expires
2. Client sends request with expired token
3. Server returns 401
4. Client sends refresh request with cookie
5. Server validates refresh token
6. Server generates new access token
7. Client retries original request
```

---

## Security Decisions

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text

### Token Security
- Access tokens: 15 minutes expiry
- Refresh tokens: 7 days expiry, stored in httpOnly cookies
- Tokens signed with strong secrets

### Authorization
- Role-based access control (brand vs customer)
- Ownership validation for product modifications
- Protected routes on both frontend and backend

### API Security
- CORS configured for frontend origin
- Input validation on all endpoints
- Error messages don't leak sensitive info

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| POST | /api/auth/logout | Logout user | Public |
| POST | /api/auth/refresh | Refresh access token | Public |
| GET | /api/auth/me | Get current user | Private |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | Get all products | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/products | Create product | Brand |
| PUT | /api/products/:id | Update product | Owner |
| DELETE | /api/products/:id | Archive product | Owner |
| GET | /api/products/brand/my-products | Get brand's products | Brand |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/categories | Get all categories | Public |
| POST | /api/categories/seed | Seed categories | Public |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for image upload)

### Installation

1. **Clone the repository**
```bash
cd marketnest
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Configure Environment Variables**
```bash
# Edit server/.env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. **Setup Frontend**
```bash
cd client
npm install
```

### Running the Application

1. **Start Backend**
```bash
cd server
npm run dev
```

2. **Start Frontend**
```bash
cd client
npm run dev
```

3. **Open Browser**
Navigate to http://localhost:5173

---

## Database Schema

### User
```javascript
{
  name: String,        // Required
  email: String,       // Required, Unique
  password: String,    // Required, Hashed
  role: String,        // 'brand' or 'customer'
  avatar: String,      // URL
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,        // Required
  description: String, // Required
  category: String,    // Required
  price: Number,       // Required
  images: [String],    // Array of URLs
  status: String,      // 'draft', 'published', 'archived'
  brand: ObjectId,     // Reference to User
  createdAt: Date
}
```

### Category
```javascript
{
  name: String,        // Required, Unique
  slug: String,        // Required, Unique
  image: String,       // URL
  createdAt: Date
}
```

---

## UI/UX Features

### Design System
- **Primary Color**: #111827 (Dark charcoal)
- **Accent Color**: #6366F1 (Indigo)
- **Background**: #F9FAFB (Light gray)
- **Fonts**: Playfair Display (headings), Inter (body)

### Animations
- Page transitions with Framer Motion
- Staggered product grid animations
- Hover effects on cards
- Smooth scrolling
- Loading skeletons

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 1024px (lg)
- Flexible grid layouts

---

## License

This project is for educational purposes.

---

## Screenshots

The application features:
- Modern hero section with animated text
- Product grid with hover effects
- Professional brand dashboard
- Clean authentication forms
- Detailed product pages with image gallery

---

## Support

For issues or questions, please refer to the project documentation or open an issue.

