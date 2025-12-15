# Demo Mode Guide

This guide explains how to use the demo mode feature that was implemented to address MongoDB connection issues and provide graceful degradation.

## What is Demo Mode?

Demo mode is a fallback mechanism that allows the website to function even when the MongoDB database is unavailable. When enabled, the application:

1. Skips all database connections
2. Returns predefined fallback data for all API endpoints
3. Allows all operations to appear successful to the user
4. Provides a seamless user experience without crashes or errors

## When to Use Demo Mode

- **Development**: When working offline or without a database
- **Testing**: To test frontend functionality without backend dependencies
- **Presentations**: To demonstrate the website without requiring a database
- **Recovery**: When the database is temporarily unavailable

## How to Enable Demo Mode

### Backend Configuration

Create or edit `backend/.env`:

```env
# Enable demo mode
DEMO_MODE=true

# Other settings (optional in demo mode)
MONGODB_URI=mongodb://localhost:27017/admin_auth
PORT=5000
```

### Frontend Configuration

Create or edit `frontend/.env`:

```env
# Enable demo mode
NEXT_PUBLIC_DEMO_MODE=true

# API base URL (not used in demo mode, but good to have)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## How Demo Mode Works

### 1. Database Connection Layer

In `backend/src/config/database.js`:
- Skips MongoDB connection when `DEMO_MODE=true`
- Tracks connection state
- Automatically enables demo mode after 3 failed connection attempts

### 2. Database Operations

In `backend/src/utils/dbHelpers.js`:
- All database operations return immediately with fallback data
- Save operations simulate success without actually writing to database
- Query operations return predefined fallback data

### 3. API Endpoints

In controller files like `backend/src/controllers/home/ctaController.js`:
- Check for demo mode before executing database operations
- Return fallback data when in demo mode
- Maintain the same response structure for consistency

### 4. Frontend Requests

In `frontend/src/lib/fetchUtils.tsx`:
- Detect demo mode from environment variables
- Skip actual network requests when in demo mode
- Return mock responses with appropriate structure

## Fallback Data

Each API endpoint has predefined fallback data that represents typical content. For example:

### CTA Section Fallback
```javascript
const fallbackCTAData = {
  id: 'main-cta',
  title: 'Transform Lives Through Education',
  description: 'Join us in making a difference...',
  primaryButton: {
    text: 'Donate Now',
    url: '/donate',
    style: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  // ... other properties
}
```

## Testing Demo Mode

### 1. Start Backend in Demo Mode
```bash
cd backend
echo "DEMO_MODE=true" > .env
npm start
```

### 2. Start Frontend in Demo Mode
```bash
cd frontend
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env
npm run dev
```

### 3. Verify Functionality
- Visit http://localhost:3000
- All pages should load without errors
- No "Service Unavailable" messages
- Content should be displayed (using fallback data)

## Disabling Demo Mode

To return to normal operation:

1. Set `DEMO_MODE=false` in `backend/.env`
2. Set `NEXT_PUBLIC_DEMO_MODE=false` in `frontend/.env`
3. Ensure MongoDB is running and accessible
4. Restart both backend and frontend servers

## Benefits of Demo Mode

1. **Zero Downtime**: Website remains functional even during database outages
2. **Offline Development**: Work on frontend without backend dependencies
3. **Easy Testing**: Test UI components without database setup
4. **Graceful Degradation**: Users see content instead of error messages
5. **Seamless Transition**: Switch between normal and demo modes without code changes

## Troubleshooting

### Issue: Demo mode not working
**Solution**: Ensure both backend and frontend have demo mode enabled in their respective `.env` files

### Issue: Still seeing database errors
**Solution**: Check that you've restarted the servers after changing environment variables

### Issue: Missing fallback data
**Solution**: Verify that controller files are using the dbHelpers utilities

## Customizing Fallback Data

To customize fallback data for your specific needs:

1. Edit the fallback data objects in controller files
2. Modify the data to match your typical content
3. Ensure the structure matches what the frontend expects

Example in `ctaController.js`:
```javascript
const fallbackCTAData = {
  // Customize these values for your organization
  title: 'Your Custom Title Here',
  description: 'Your custom description here...',
  // ... other properties
}
```

Demo mode provides a robust solution for maintaining website functionality regardless of database availability.