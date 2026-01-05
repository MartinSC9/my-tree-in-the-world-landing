# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**My Tree in the World** is a tree planting platform that connects users who want to plant virtual trees with physical tree planting operations. The system coordinates workflows between users, companies, nurseries (viveros), planters (plantadores), and administrators.

The project is split into two separate applications:
- **Frontend** (`my-tree-in-the-world-front/`) - React SPA with Vite
- **Backend** (`my-tree-in-the-world-back/`) - Node.js Express REST API with MySQL

## Development Commands

### Frontend (my-tree-in-the-world-front/)
```bash
npm install              # Install dependencies
npm run dev              # Start development server (port 5173)
npm start                # Start dev server and open browser
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend (my-tree-in-the-world-back/)
```bash
npm install              # Install dependencies
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server (port 5000)

# Database setup
mysql -u root -p < database/schema.sql      # Create database schema
mysql -u root -p < database/seeds.sql       # Seed initial data
node create-admin.js                        # Create admin user
node run-migration.js                       # Run soft delete migration
node create-test-users.js                   # Create test users
```

**Important**: The backend requires a `.env` file. Copy `.env.example` and configure:
- `DB_PASSWORD` - MySQL password
- `JWT_SECRET` - JWT secret for tokens
- `JWT_REFRESH_SECRET` - Refresh token secret
- `DB_SSL=true` - For cloud databases (Aiven, AWS RDS)

## Architecture

### Role-Based System

The platform has **5 distinct user roles**, each with dedicated dashboards and workflows:

1. **user** - Regular users who plant virtual trees
2. **company** - Companies that calculate carbon footprint and plant corporate trees
3. **admin** - System administrators with full access
4. **vivero** - Nurseries that prepare physical trees
5. **plantador** - Planters who plant trees in the field

**Role routing pattern**:
- Admin: `/admin/dashboard`
- Company: `/empresa/dashboard`
- User: `/usuario/:userId/*`
- Vivero: `/vivero/dashboard`
- Plantador: `/plantador/dashboard`

### Tree Planting Workflow

Trees progress through a **work order system** with status transitions:

**Tree statuses** (trees.status): `en_proceso` → `plantado` → `verificado`
- Note: `sin_plantar` exists in schema but is not used - trees are created directly as `en_proceso`

**Work order states** (work_orders.status):

For **public spaces** (auto-approved, app has municipal permit):
```
Payment → autorizada → asignada_vivero → vivero_preparando →
planta_lista → entregada_plantador → plantador_en_camino → plantando → plantada
```

For **private property** ("Mi Domicilio", requires DNI verification):
```
Payment → pendiente_autorizacion → [Admin verifies DNI] → autorizada →
asignada_vivero → vivero_preparando → planta_lista →
entregada_plantador → plantador_en_camino → plantando → plantada
```

**User-visible timeline** (6 steps):
1. Preparando (vivero_preparando)
2. Planta Lista (planta_lista)
3. Con Plantador (entregada_plantador)
4. En Camino (plantador_en_camino)
5. Plantando (plantando)
6. Plantada (plantada)

### Address Verification System (Own Property Trees)

For trees planted in "Mi Domicilio" (own property), a **post-payment verification** system is required:

**Workflow**:
1. User selects "Mi Domicilio" location type (no pre-registration required)
2. User completes tree customization and payment ($24,000 ARS)
3. After successful payment, `AddressVerificationModal` appears automatically
4. User uploads photo of document (DNI, passport, utility bill showing address)
5. **AI Verification** (recommended):
   - OCR extracts address from document (Google Cloud Document AI / AWS Textract)
   - System geocodes extracted address
   - Compares with tree's GPS coordinates
   - If distance < 100m: ✅ Auto-approved (30-120 seconds)
   - If distance 100-500m: 🟡 Manual review required
   - If distance > 500m: ❌ Auto-rejected (user can resubmit)
6. If user skips modal: 7-day grace period reminder
7. After 7 days without verification: Tree marked as "pending_verification"

**Implementation**:
- **Frontend**:
  - `AddressVerificationModal.jsx` - Upload component with drag-drop and preview
  - `addressVerificationService.js` - API client for verification endpoints
  - PlantTreeWizard integration shows modal after payment for own_property type
- **Backend** (to implement):
  - `POST /api/address-verification/upload` - Upload document with tree_id, lat, lng
  - `GET /api/address-verification/status/:treeId` - Check verification status
  - `PUT /api/address-verification/:id/status` - Admin approve/reject
  - `GET /api/address-verification/pending` - Admin dashboard list

**Database requirements** (to implement):
```sql
CREATE TABLE address_verifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tree_id INT NOT NULL,
  user_id INT NOT NULL,
  document_url VARCHAR(500) NOT NULL, -- S3/storage URL
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  status ENUM('pending', 'approved', 'rejected', 'auto_approved') DEFAULT 'pending',
  verification_method ENUM('ai', 'manual') NULL,
  confidence_score DECIMAL(5,2) NULL, -- AI confidence 0-100
  extracted_address TEXT NULL, -- OCR result
  rejection_reason TEXT NULL,
  verified_by INT NULL, -- admin user_id
  FOREIGN KEY (tree_id) REFERENCES trees(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Security & Privacy**:
- Document images encrypted at rest (S3 server-side encryption)
- Access restricted to user who uploaded and admins only
- Images auto-deleted 90 days after verification
- Users can obscure sensitive data (document number) as long as address is visible

### Frontend Architecture

**Context providers** (wrapping order matters):
- `AuthProvider` - Authentication state and user session
- `TreeProvider` - Tree data and operations

**Component organization**:
- `components/` - Reusable components (Navbar, TreeMap, certificates)
- `components/ui/` - Shadcn/ui components (button, card, dialog, etc.)
- `components/dashboard/{role}/` - Role-specific dashboard content components
- `pages/` - Top-level route pages
- `pages/landing/` - Public landing pages (LandingHome, AboutPage, EmpresasPage)
- `contexts/` - React Context providers
- `services/` - API communication layer
- `layouts/` - Layout wrappers (DashboardLayout, AuthenticatedLayout)

**Key architectural patterns**:
- All pages use `AuthenticatedLayout` wrapper (includes Navbar with auth detection)
- Protected routes use `ProtectedRoute` component with `requiredRole` prop
- Role-based dashboards use specialized content components in `components/dashboard/{role}/`
- API calls go through service layer (`services/`) not directly from components

### Backend Architecture

**Standard Express structure**:
- `src/server.js` - Entry point, middleware setup, route registration
- `src/config/database.js` - MySQL connection pool
- `src/controllers/` - Request handlers, business logic
- `src/routes/` - Express route definitions
- `src/middleware/` - Auth, error handling, role checks
- `src/utils/` - Helper functions
- `database/` - SQL schemas, seeds, migrations

**API Routes** (all prefixed with `/api`):
- `/auth` - Login, register, logout, me, change-password
- `/trees` - CRUD operations for trees
- `/users` - User management (admin only for most operations)
- `/work-orders` - Work order management
- `/carbon` - Carbon footprint calculator config
- `/audit` - Audit logs (admin only)
- `/moderation` - Content moderation (admin only)
- `/roles` - Role documentation and permissions
- `/posts` - Community posts, likes, comments
- `/notifications` - User notifications
- `/messages` - User messaging
- `/ratings` - Planter ratings
- `/stats` - System statistics

**Authentication**:
- JWT-based with access and refresh tokens
- Tokens stored in localStorage (frontend)
- `auth.js` middleware protects routes
- `roleCheck.js` middleware validates user roles
- Login blocks inactive users (`is_active = FALSE`) or soft-deleted users (`deleted_at IS NOT NULL`)

### Database Schema

**Core tables**:
- `users` - User accounts with role field and company fields
- `trees` - Virtual and physical tree records
- `work_orders` - Planting workflow coordination
- `audit_logs` - System audit trail
- `carbon_config` - Carbon calculation configuration
- `community_posts` - Social feed posts
- `post_likes` - Post likes
- `post_comments` - Post comments
- `notifications` - User notifications
- `user_messages` - Direct messages
- `planter_ratings` - Ratings for planters
- `refresh_tokens` - JWT refresh tokens

**Soft delete implementation**:
- Tables with soft delete: `users`, `trees`, `work_orders`, `community_posts`
- Columns: `deleted_at TIMESTAMP NULL`, `deleted_by INT NULL`
- Users also have `is_active BOOLEAN DEFAULT TRUE`
- Soft deleted records can be restored by admins
- Queries must filter `WHERE deleted_at IS NULL` to exclude deleted records

### CORS Configuration

Backend supports multiple frontend origins:
- `http://localhost:5173` - Landing page (development)
- `http://localhost:5174` - App dashboard (development)
- Vercel deployments (production/QA)
- Additional URL from `FRONTEND_URL` env var

## Test Users

See `USUARIOS_PRUEBA.md` (frontend) for complete test credentials.

**Quick reference**:
- Admin: `administrador@miarbol.com` / `admin123`
- Company: `empresa@miarbol.com` / `Password123!`
- Plantador: `plantador@miarbol.com` / `admin123`
- Vivero: `vivero@miarbol.com` / `admin123`

## Technology Stack

**Frontend**:
- React 18 + React Router 6
- Vite (build tool)
- Tailwind CSS + Shadcn/ui components
- Radix UI primitives
- Leaflet + react-leaflet (maps)
- Framer Motion (animations)
- Axios (HTTP client)
- jsPDF + html2canvas (certificate generation)

**Backend**:
- Node.js + Express 5
- MySQL 2 (database driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- express-validator (input validation)
- helmet (security headers)
- morgan (HTTP logging)

## Common Development Patterns

### Adding a new API endpoint

1. Create controller function in `src/controllers/{domain}Controller.js`
2. Add route in `src/routes/{domain}.routes.js`
3. Register route in `src/server.js`
4. Add service function in frontend `src/services/{domain}Service.js`
5. Use service in component/page

### Adding a new protected page

1. Create page component in `src/pages/`
2. Add route to `src/App.jsx` wrapped with `<ProtectedRoute requiredRole="...">`
3. Wrap with `<AuthenticatedLayout>` if needs navbar

### Querying with soft delete

Always filter out soft-deleted records:
```javascript
// Bad
const users = await db.query('SELECT * FROM users');

// Good
const users = await db.query('SELECT * FROM users WHERE deleted_at IS NULL');
```

## Known Issues & Considerations

- **Port conflicts**: Frontend defaults to 5173, backend to 5000. If ports are in use, Vite will try next available port.
- **Database migrations**: Run `node run-migration.js` after pulling schema changes.
- **Soft delete queries**: Many existing queries don't filter `deleted_at IS NULL` - needs systematic fixing.
- **Multi-role users**: System doesn't currently support users with multiple roles simultaneously.
- **Certificate generation**: Uses html2canvas which can be slow for complex layouts.

## Project Structure

```
my-tree-in-the-world/
├── my-tree-in-the-world-front/    # Frontend React app
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── ui/                # Shadcn UI components
│   │   │   └── dashboard/         # Role-specific dashboard components
│   │   ├── contexts/              # React Context providers
│   │   ├── pages/                 # Route pages
│   │   │   └── landing/           # Public landing pages
│   │   ├── services/              # API services
│   │   ├── layouts/               # Layout wrappers
│   │   └── lib/                   # Utilities
│   └── package.json
│
└── my-tree-in-the-world-back/     # Backend Express API
    ├── src/
    │   ├── config/                # Database connection
    │   ├── controllers/           # Route handlers
    │   ├── routes/                # Express routes
    │   ├── middleware/            # Auth, error handlers
    │   └── utils/                 # Helpers
    ├── database/                  # SQL files
    │   ├── schema.sql             # Database schema
    │   └── seeds.sql              # Seed data
    └── package.json
```
