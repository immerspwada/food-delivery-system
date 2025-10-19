# WWDelive API Documentation

## API Structure Overview

The API has been reorganized following Data Engineering and RESTful API best practices. All endpoints are categorized into logical groups:

### 🔐 Authentication (`/api/auth/`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### 👤 User Management (`/api/user/`)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add new address
- `PUT /api/user/addresses/[id]` - Update address
- `DELETE /api/user/addresses/[id]` - Delete address

### 🏪 Restaurant Management (`/api/restaurant/`)
- `GET /api/restaurant/` - List restaurants with filters
- `GET /api/restaurant/search` - Search restaurants
- `GET /api/restaurant/[id]` - Get restaurant details
- `PUT /api/restaurant/[id]` - Update restaurant (admin only)
- `DELETE /api/restaurant/[id]` - Delete restaurant (admin only)

### 🍽️ Menu Management (`/api/menu/`)
- `GET /api/menu/items` - Get menu items with filters
- `GET /api/menu/categories` - Get menu categories
- `POST /api/menu/categories` - Create category (admin only)
- `PUT /api/menu/categories` - Update category (admin only)
- `DELETE /api/menu/categories` - Delete category (admin only)
- `GET /api/menu/[restaurantId]` - Get restaurant menu

### 📦 Order Management (`/api/order/`)
- `GET /api/order/` - List user orders
- `POST /api/order/` - Create new order
- `GET /api/order/[id]` - Get order details
- `PUT /api/order/[id]` - Update order
- `DELETE /api/order/[id]` - Cancel order
- `GET /api/order/history` - Get order history with filters
- `GET /api/order/stats` - Get order statistics

### ⚙️ System Management (`/api/system/`)
- `GET /api/system/health` - Health check endpoint
- `GET /api/system/config` - Get system configuration
- `PUT /api/system/config` - Update system configuration (admin only)

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional message",
  "pagination": {
    // Pagination info for list endpoints
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error Handling

Error responses include appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## Environment Variables

Required environment variables:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret key for JWT token signing
- `REACT_APP_SUPABASE_URL` - Public Supabase URL for client
- `REACT_APP_SUPABASE_ANON_KEY` - Public Supabase anon key for client

## Data Engineering Principles Applied

1. **Separation of Concerns**: APIs are grouped by business domain
2. **Consistent Naming**: RESTful naming conventions throughout
3. **Scalable Structure**: Easy to add new endpoints within existing categories
4. **Security**: Proper authentication and authorization checks
5. **Error Handling**: Consistent error response format
6. **Documentation**: Clear API documentation and examples
7. **Performance**: Efficient database queries with proper indexing considerations
8. **Maintainability**: Clean code structure with reusable components

## Migration Notes

The old API structure has been completely reorganized:

- Old `/client/api/` endpoints have been consolidated into `/api/`
- Redundant endpoints have been removed
- Naming conventions have been standardized
- Authentication flow has been improved
- Better error handling and response formatting

## Testing

Use the health check endpoint to verify API functionality:

```bash
curl https://your-domain.vercel.app/api/system/health
```

This should return a 200 status with system health information.