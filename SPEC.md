# MarketNest - Mini Fashion Marketplace

## Project Overview
- **Project Name**: MarketNest
- **Type**: Full-stack E-commerce Web Application
- **Core Functionality**: A fashion marketplace where brands can list and manage products while customers can browse, search, and purchase fashion items
- **Target Users**: Fashion brands (sellers) and fashion-conscious customers

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access Token + Refresh Token)
- **Password Hashing**: bcrypt
- **Image Upload**: Cloudinary
- **Environment**: dotenv
- **Cookies**: cookie-parser

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## UI/UX Specification

### Color Palette
```css
--primary: #111827       /* Dark charcoal */
--primary-light: #1F2937 /* Lighter dark */
--accent: #6366F1        /* Indigo accent */
--accent-hover: #4F46E5  /* Darker accent */
--background: #F9FAFB    /* Light gray */
--surface: #FFFFFF       /* White cards */
--text-primary: #111827  /* Primary text */
--text-secondary: #6B7280 /* Secondary text */
--text-muted: #9CA3AF    /* Muted text */
--border: #E5E7EB        /* Border color */
--success: #10B981       /* Success green */
--error: #EF4444         /* Error red */
--warning: #F59E0B       /* Warning amber */
```

### Typography
- **Primary Font**: 'Playfair Display' (headings) - elegant serif for fashion
- **Secondary Font**: 'Inter' (body) - clean sans-serif
- **Headings**: 
  - H1: 48px/56px, font-weight: 700
  - H2: 36px/44px, font-weight: 600
  - H3: 24px/32px, font-weight: 600
  - H4: 20px/28px, font-weight: 500
- **Body**: 16px/24px, font-weight: 400
- **Small**: 14px/20px, font-weight: 400

### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Effects
- **Shadows**: 
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 15px rgba(0,0,0,0.1)
  - xl: 0 20px 25px rgba(0,0,0,0.15)
- **Border Radius**: 4px (small), 8px (medium), 12px (large), 9999px (pill)
- **Transitions**: 200ms ease-out (default), 300ms ease-in-out (modals)

---

## Page Structure

### 1. Landing Page (Public)
- **Hero Section**: Full-width with animated text and CTA buttons
- **Featured Categories**: Grid of fashion categories
- **Trending Products**: Carousel of popular items
- **Why Choose Us**: Value propositions
- **Footer**: Links, social media, newsletter

### 2. Authentication Pages
- **Login**: Email/password form, remember me, role selection info
- **Register**: Role selection (Brand/Customer), form fields, terms acceptance

### 3. Customer Pages
- **Home**: Hero, categories, featured products
- **Browse/Shop**: Product grid with filters, search, pagination
- **Product Detail**: Image gallery, product info, add to favorites
- **Profile**: View/edit profile (future)

### 4. Brand Dashboard
- **Overview**: Stats cards (total, published, archived products)
- **Products**: Table/grid of brand's products
- **Add Product**: Form with image upload
- **Edit Product**: Pre-filled form
- **Product Management**: Draft/Publish/Archive/Delete

---

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
POST   /api/auth/refresh     - Refresh access token
GET    /api/auth/me          - Get current user
```

### Users
```
GET    /api/users/:id        - Get user profile
PUT    /api/users/:id        - Update user profile
```

### Products
```
GET    /api/products         - Get all products (with filters, pagination)
GET    /api/products/:id     - Get single product
POST   /api/products         - Create product (Brand only)
PUT    /api/products/:id     - Update product (Owner only)
DELETE /api/products/:id     - Delete product (Owner only)
```

### Categories
```
GET    /api/categories       - Get all categories
```

---

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['brand', 'customer']),
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  category: String (required),
  price: Number (required),
  images: [String] (array of URLs),
  status: String (enum: ['draft', 'published', 'archived']),
  brand: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String (required, unique),
  slug: String (required, unique),
  image: String,
  createdAt: Date
}
```

---

## Authentication Flow

### Registration
1. User selects role (brand/customer)
2. Fills registration form (name, email, password)
3. Password hashed with bcrypt (10 rounds)
4. JWT tokens generated
5. Refresh token stored in httpOnly cookie
6. Access token returned in response

### Login
1. User enters email/password
2. Credentials validated
3. JWT tokens generated
4. Refresh token in httpOnly cookie
5. User redirected to appropriate dashboard

### Token Refresh
1. Access token expires
2. Frontend sends refresh request with cookie
3. Backend validates refresh token
4. New access token issued

---

## Security Implementations

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Access Token**: 15 minutes expiry
3. **JWT Refresh Token**: 7 days expiry, httpOnly cookie
4. **Role Middleware**: Verify brand vs customer permissions
5. **Ownership Middleware**: Prevent editing others' products
6. **Input Validation**: Joi/express-validator
7. **CORS**: Configured for frontend origin
8. **Helmet**: Security headers
9. **Rate Limiting**: 100 requests per 15 minutes

---

## Frontend Components

### Layout Components
- Navbar (sticky, transparent on hero)
- Footer
- Layout wrapper

### UI Components
- Button (primary, secondary, outline, ghost)
- Input (text, email, password)
- Select
- Card
- Modal
- Skeleton
- Toast notifications
- Loading spinner
- Empty state

### Feature Components
- ProductCard
- ProductGrid
- ProductFilters
- SearchBar
- ImageGallery
- Pagination
- StatsCard (dashboard)

---

## Animations

### Page Transitions
- Fade in/out on route change
- Staggered list animations

### Interactions
- Button hover: scale(1.02), background change
- Card hover: translateY(-4px), shadow increase
- Image hover: scale(1.05) with overflow hidden

### Loading States
- Skeleton pulse animation
- Spinner rotation

### Hero Section
- Text fade-in with stagger
- Background parallax (optional)

---

## Project Structure

```
/marketnest
├── SPEC.md
├── README.md
├── server/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Category.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── productController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── utils/
│       ├── cloudinary.js
│       └── jwtUtils.js
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Layout/
    │   │   ├── UI/
    │   │   └── Product/
    │   ├── pages/
    │   │   ├── Home/
    │   │   ├── Auth/
    │   │   ├── Shop/
    │   │   ├── ProductDetail/
    │   │   └── Dashboard/
    │   └── hooks/
    │       └── useAuth.js
```

---

## Acceptance Criteria

### Authentication
- [ ] Users can register as Brand or Customer
- [ ] Users can login with email/password
- [ ] Users can logout
- [ ] JWT tokens work correctly
- [ ] Protected routes redirect to login

### Brand Features
- [ ] Brand can view dashboard with stats
- [ ] Brand can create new product
- [ ] Brand can upload multiple images
- [ ] Brand can save as draft
- [ ] Brand can publish product
- [ ] Brand can edit own products
- [ ] Brand can delete own products
- [ ] Brand cannot edit others' products

### Customer Features
- [ ] Customer can browse all products
- [ ] Customer can search by name
- [ ] Customer can filter by category
- [ ] Customer can view product details
- [ ] Customer can view image gallery
- [ ] Pagination works correctly

### UI/UX
- [ ] Responsive on mobile, tablet, desktop
- [ ] Smooth animations throughout
- [ ] Loading states visible
- [ ] Toast notifications appear
- [ ] Forms have proper validation
- [ ] Premium, modern aesthetic

### Performance
- [ ] Fast page loads
- [ ] Optimized images
- [ ] Efficient API calls
- [ ] Proper error handling

