# Product Requirements Document (PRD)
# Pee's Bakery & Restaurant — Admin Panel & Supabase Integration

## Document Information
- **Project Name:** Pee's Bakery Admin Dashboard
- **Version:** 1.1
- **Date:** March 2026
- **Status:** Phase 1 Complete — In Active Development

---

## 1. Executive Summary

### 1.1 Purpose
Build a comprehensive admin panel for Pee's Bakery & Restaurant that allows the restaurant owner to manage all aspects of the business including products, orders, prices, categories, and customer requests. The admin panel will share the same Supabase database as the customer-facing website but will be completely isolated from customer access.

### 1.2 Goals
- Enable full CRUD operations for products (Create, Read, Update, Delete)
- Manage product prices, images, variants, and add-ons
- View and manage customer orders in real-time
- Control what customers see on the website
- Maintain the same design aesthetic as the main website
- Ensure complete separation between admin and customer environments

---

## 2. System Architecture

### 2.1 Technology Stack
- **Frontend:** Next.js 16, React 19.2, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Backend:** Supabase (PostgreSQL database + Authentication)
- **Authentication:** Supabase Auth with admin role verification
- **File Storage:** Supabase Storage for product images

### 2.2 Database Schema (Already Created)
```
Tables:
- products (main product info)
- product_variants (size/type options)
- product_addons (extra items)
- product_images (multiple images per product)
- categories (product categories)
- orders (customer orders)
- order_items (items in each order)
- admin_profiles (admin user management)
- site_settings (restaurant configuration)
```

### 2.3 Security Model
- Row Level Security (RLS) on all tables
- Admin routes protected by middleware
- Admin verification via `user_metadata.is_admin` flag
- Customers cannot access /admin routes
- Admin tokens refreshed via middleware

---

## 3. Design Specifications

### 3.1 Design System (Match Existing Website)
```css
Colors:
- Primary: #166534 (dark green)
- Secondary: #f97316 (orange)
- Background: #f5f0e8 (cream/beige)
- Text Primary: #1a1a1a
- Text Secondary: #6b7280
- Card Background: #ffffff
- Border: #e5e7eb
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b

Typography:
- Font Family: Geist Sans (headings), Geist Sans (body)
- Heading sizes: 2rem, 1.5rem, 1.25rem, 1rem
- Body: 0.875rem - 1rem
- Line height: 1.5 - 1.75

Spacing:
- Container max-width: 1400px
- Card padding: 1.5rem
- Grid gap: 1rem - 1.5rem
- Border radius: 0.75rem (cards), 0.5rem (buttons)
```

### 3.2 Layout Structure
```
Admin Layout:
├── Sidebar (240px fixed)
│   ├── Logo (Pee's Bakery)
│   ├── Navigation Links
│   │   ├── Dashboard
│   │   ├── Orders
│   │   ├── Products
│   │   ├── Categories
│   │   ├── Settings
│   │   └── Logout
│   └── Admin Profile Info
├── Main Content Area
│   ├── Header (breadcrumb, search, notifications)
│   └── Page Content (scrollable)
└── Footer (minimal)
```

---

## 4. Feature Specifications

### 4.1 Authentication (/admin/login)

**Login Page Requirements:**
- Email and password authentication
- "Remember me" option
- Error handling for invalid credentials
- Redirect to dashboard on success
- Admin-only access verification

**Implementation:**
```typescript
// Check admin status after login
const { data: { user } } = await supabase.auth.getUser()
const isAdmin = user?.user_metadata?.is_admin === true
```

---

### 4.2 Dashboard (/admin)

**Features:**
- Today's order count and revenue
- Pending orders alert
- Recent orders list (last 10)
- Top selling products
- Quick actions (add product, view orders)
- Real-time updates using Supabase subscriptions

**Metrics Cards:**
1. Total Orders Today
2. Revenue Today
3. Pending Orders
4. Products Count

---

### 4.3 Orders Management (/admin/orders)

**List View:**
- Table with columns: Order ID, Customer, Items, Total, Status, Date, Actions
- Filter by status (pending, confirmed, preparing, ready, delivered, cancelled)
- Search by customer name or phone
- Date range filter
- Sort by date (newest first)
- Pagination (20 per page)

**Order Details Modal/Page:**
- Customer information (name, phone, address)
- Delivery method (delivery/pickup)
- Payment method and proof image
- Order items with quantities and prices
- Subtotal, delivery fee, total
- Order notes
- Status update dropdown
- Order timeline/history

**Status Flow:**
```
pending → confirmed → preparing → ready → out_for_delivery → delivered
                                   ↓
                              cancelled
```

**Actions:**
- Update order status
- Print order receipt
- Contact customer (WhatsApp link)
- Cancel order (with reason)

---

### 4.4 Products Management (/admin/products)

**List View:**
- Grid or table view toggle
- Product image thumbnail, name, category, price, status
- Quick price edit inline
- Toggle active/inactive
- Search and filter by category
- Bulk actions (activate, deactivate, delete)

**Add/Edit Product Form:**
```
Fields:
- Name* (text)
- Category* (dropdown)
- Price* (number)
- Description* (textarea, short)
- Long Description (textarea, detailed)
- Featured (toggle)
- Active (toggle)
- Is Customizable (toggle, for custom cakes)

Images:
- Main image upload (drag & drop)
- Additional images (up to 5)
- Image preview and reorder

Variants (optional):
- Add variant: Name, Price, Description
- Sortable list
- Remove variant

Add-ons (optional):
- Add add-on: Name, Price
- Sortable list
- Remove add-on
```

**Product Card Preview:**
- Show how product will appear to customers
- Live preview as admin edits

---

### 4.5 Categories Management (/admin/categories)

**Features:**
- List all categories
- Add new category
- Edit category name
- Reorder categories (drag & drop)
- Activate/deactivate category
- Delete category (confirm if has products)

**Fields:**
- ID (slug, auto-generated)
- Name
- Display Order
- Active Status

---

### 4.6 Settings (/admin/settings)

**Restaurant Settings:**
- Restaurant name
- Phone number
- WhatsApp number
- Address
- Opening hours
- Delivery fee
- Currency symbol

**Admin Profile:**
- View/edit own profile
- Change password
- Email notifications preferences

**Super Admin Only:**
- Manage other admin users
- Add new admin
- Deactivate admin account

---

## 5. API Routes

### 5.1 Products API
```
GET    /api/admin/products         - List all products
GET    /api/admin/products/[id]    - Get single product
POST   /api/admin/products         - Create product
PUT    /api/admin/products/[id]    - Update product
DELETE /api/admin/products/[id]    - Delete product
POST   /api/admin/products/upload  - Upload product image
```

### 5.2 Orders API
```
GET    /api/admin/orders           - List orders (with filters)
GET    /api/admin/orders/[id]      - Get order details
PUT    /api/admin/orders/[id]      - Update order status
GET    /api/admin/orders/stats     - Get order statistics
```

### 5.3 Categories API
```
GET    /api/admin/categories       - List categories
POST   /api/admin/categories       - Create category
PUT    /api/admin/categories/[id]  - Update category
DELETE /api/admin/categories/[id]  - Delete category
PUT    /api/admin/categories/reorder - Reorder categories
```

### 5.4 Settings API
```
GET    /api/admin/settings         - Get all settings
PUT    /api/admin/settings         - Update settings
```

---

## 6. Customer-Side Updates

### 6.1 Order Submission
When customer places order, create records in:
- `orders` table (main order info)
- `order_items` table (each item in cart)

### 6.2 Products Display
- Fetch products from `products` table instead of static file
- Respect `is_active` flag
- Include variants and add-ons from related tables

### 6.3 Real-time Updates
- Use Supabase real-time subscriptions for order status
- Customer can track their order status

---

## 7. File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard
│   ├── login/
│   │   └── page.tsx            # Admin login
│   ├── orders/
│   │   ├── page.tsx            # Orders list
│   │   └── [id]/
│   │       └── page.tsx        # Order details
│   ├── products/
│   │   ├── page.tsx            # Products list
│   │   ├── new/
│   │   │   └── page.tsx        # Add product
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit product
│   ├── categories/
│   │   └── page.tsx            # Categories management
│   └── settings/
│       └── page.tsx            # Settings
├── api/
│   └── admin/
│       ├── products/
│       │   └── route.ts
│       ├── orders/
│       │   └── route.ts
│       ├── categories/
│       │   └── route.ts
│       └── settings/
│           └── route.ts
components/
├── admin/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── stats-card.tsx
│   ├── orders-table.tsx
│   ├── products-grid.tsx
│   ├── product-form.tsx
│   ├── category-list.tsx
│   └── settings-form.tsx
lib/
├── supabase/
│   ├── client.ts               # Browser client
│   ├── server.ts               # Server client
│   └── middleware.ts           # Auth middleware
├── admin-actions.ts            # Server actions for admin
└── types/
    └── admin.ts                # Admin-specific types
```

---

## 8. Component Specifications

### 8.1 Admin Sidebar
```tsx
// Components needed:
- Logo with restaurant name
- Navigation items with icons
- Active state highlighting
- Collapsible on mobile
- Admin user info at bottom
- Logout button
```

### 8.2 Stats Card
```tsx
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}
```

### 8.3 Orders Table
```tsx
// Features:
- Sortable columns
- Status badges with colors
- Expandable rows for order details
- Bulk selection
- Action dropdown per row
- Responsive (cards on mobile)
```

### 8.4 Product Form
```tsx
// Features:
- Form validation
- Image upload with preview
- Dynamic variant/addon fields
- Category dropdown
- Price formatting
- Save draft capability
- Preview panel
```

---

## 9. State Management

### 9.1 Client State
- Use React useState for form inputs
- Use SWR for data fetching and caching
- Real-time subscriptions for orders

### 9.2 Server State
- Server actions for mutations
- Revalidate paths after mutations
- Optimistic updates for better UX

---

## 10. Security Requirements

### 10.1 Authentication
- Supabase Auth with email/password
- Session refresh via middleware
- Automatic logout on inactivity

### 10.2 Authorization
- RLS policies on all tables
- Admin role check in middleware
- API route protection

### 10.3 Data Validation
- Server-side validation on all inputs
- Sanitize user inputs
- File upload restrictions (images only, max 5MB)

---

## 11. Testing Requirements

### 11.1 Test Scenarios
- Admin login with valid/invalid credentials
- CRUD operations for products
- Order status updates
- Category management
- Settings updates
- Unauthorized access attempts

---

## 12. Deployment Notes

### 12.1 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (for admin operations)
```

### 12.2 First Admin Setup
1. Go to your Supabase project > **Authentication > Users > Add User**.
2. Enter the admin email and a secure password. Copy the new user's UUID.
3. Run the following SQL in the Supabase SQL Editor:

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
VALUES (
  '<paste-user-uuid-here>',
  'admin@peesbakery.com',
  'Pee',
  'super_admin',
  true
);
```

4. Visit `/admin/login` and sign in with the email and password.

---

## 13. Future Enhancements (v2.0)

- Push notifications for new orders
- Analytics dashboard with charts
- Inventory management
- Customer database
- Loyalty program management
- Multi-language support
- Export reports (CSV/PDF)
- Integration with delivery services

---

## 14. Acceptance Criteria

### 14.1 Must Have (MVP)
- [x] Admin login with role verification — `/app/admin/login/page.tsx`
- [x] Dashboard with order stats — `/app/admin/page.tsx`
- [x] Orders list with status management — `/app/admin/page.tsx`
- [x] Products CRUD with image path — `/app/admin/products/page.tsx`
- [x] Orders saved to Supabase on checkout — `/lib/actions/orders.ts`
- [x] All database tables created with RLS — Supabase migration applied
- [ ] Admin Settings page — `/app/admin/settings/page.tsx` (Phase 2)
- [ ] Categories management — `/app/admin/categories/page.tsx` (Phase 2)

### 14.2 Should Have
- [x] Real-time order notifications via Supabase Realtime
- [ ] Product image upload via Vercel Blob (Phase 2)
- [ ] Order printing / WhatsApp quick action (Phase 2)
- [ ] Bulk product actions (Phase 2)

### 14.3 Nice to Have
- [ ] Analytics charts
- [ ] Customer order tracking page
- [ ] Mobile app-like experience

---

## 15. Timeline Estimate

| Phase | Features | Duration |
|-------|----------|----------|
| 1 | Auth + Dashboard | 2-3 days |
| 2 | Orders Management | 2-3 days |
| 3 | Products CRUD | 3-4 days |
| 4 | Categories + Settings | 1-2 days |
| 5 | Customer Integration | 2-3 days |
| 6 | Testing + Polish | 2-3 days |

**Total Estimated Time: 12-18 days**

---

## 16. Contact Information

**Restaurant:** Pee's Bakery & Restaurant  
**Location:** Freetown, Sierra Leone  
**Phone/WhatsApp:** +232 78 891638

---

*This PRD is ready for handoff to another AI or development team. All database schemas have been created and Supabase integration is set up.*
